import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import bcrypt from 'bcrypt'
import { createSession } from '../../service/auth.js'
import schema from '../../schemas/shared/registerRequestBodySchema.js'
import { z } from 'zod'
import { ResponseBody } from '../../types/shared.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    const { username, pass } = await schema.parseAsync(req.body)

    const users = await db`select * from users where username = ${username}`

    if (users.length) {
      return res
        .status(409)
        .json({ message: 'Пользователь с таким именем уже существует' } as ResponseBody)
    }

    //прошли  проверку, регистрируем
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(pass, salt)

    const dbResponse =
      await db`insert into users (username, pass) values (${username}, ${hash}) returning id`
    if (!dbResponse[0]) return
    const userId = dbResponse[0].id

    const { token } = await createSession(userId, req)

    res
      .setHeader('Set-Cookie', [
        `session_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=315360000;`,
      ])
      .status(200)
      .json({ message: 'success' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('ошибка zod ', error)
      return res.status(500).json({ message: 'ошибка zod' })
    }

    console.log('неизвестная ошибка')
    return res.status(500).json({ message: 'неизвестная ошибка' })
  }

  return
}
