import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import type { ResponseBody, User } from '../../types/shared.js'
import bcrypt from 'bcrypt'
import { createSession } from '../../service/auth.js'
import { LoginRequiestBody, LoginResponseData } from '../../types/contracts.js'

// TODO: убрать валидацию на уровне контрактов
// TODO: убрать спагетти код

export default async function (req: VercelRequest, res: VercelResponse) {
  const body = req.body as LoginRequiestBody

  const { username, pass } = body
  const [user] = (await db`select * from users where username = ${username}`) as User[]

  if (!user) {
    return res.status(401).json({ message: 'пользователь не найден' } as ResponseBody)
  }

  const userHash = user.pass as string

  const comparison = await bcrypt.compare(pass, userHash)

  if (!comparison) {
    return res.status(401).json({ message: 'неверный логин или пароль' } as ResponseBody)
  }

  const { token } = await createSession(user.id, req)
  res.setHeader('Set-Cookie', [
    `session_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000;`,
  ])

  const response: ResponseBody<LoginResponseData> = {
    message: 'success',
    data: { auth: { username } },
  }

  return res.status(200).json(response)
}
