import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import bcrypt from 'bcrypt'
import { createSession } from '../../service/auth.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  // проверки типов
  const body = req.body as unknown

  if (!(body instanceof Object)) {
    res.json({ type: 'error', message: 'body is not an object' })
    return
  }
  if (
    !('username' in body) ||
    !('pass' in body) ||
    typeof body.username != 'string' ||
    typeof body.pass != 'string'
  ) {
    res.json({ type: 'error', message: 'неверно переданы username и pass' })
    return
  }

  const { username, pass } = body

  const users = await db`select * from users where username = ${username}`

  if (users.length) {
    res.json({ type: 'error', message: 'Пользователь с таким именем уже существует' })
    return
  }

  //прошли  проверку, регистрируем

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(pass, salt)

  const dbResponse =
    await db`insert into users (username, pass) values (${username}, ${hash}) returning id`
  const userId = dbResponse[0].id

  const { token } = await createSession(userId, req)

  res.setHeader('Set-Cookie', [
    `session_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43800;`,
  ])

  res.json({ type: 'success', data: { username } })
}
