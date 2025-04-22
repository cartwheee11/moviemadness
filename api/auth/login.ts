import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import bcrypt from 'bcrypt'
import { createSession } from '../../service/auth.js'

export default async function (req: VercelRequest, res: VercelResponse) {
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
    res.json({ type: 'error', message: 'there is no login or pass fields in body' })
    return
  }

  const { username, pass } = body

  const users = await db`select * from users where username = ${username}`
  if (users.length) {
    const user = users[0]

    const userHash = user.pass as string
    const userId = user.id

    const comparison = await bcrypt.compare(pass, userHash)

    if (comparison) {
      const { token } = await createSession(userId, req)
      res.setHeader('Set-Cookie', [
        `session_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43800;`,
      ])
      res.json({ type: 'success', auth: { username } })
    } else {
      res.json({ type: 'error', message: 'неверный пароль' })
    }
  } else {
    res.json({ type: 'error', message: 'пользователь не найден' })
  }
}
