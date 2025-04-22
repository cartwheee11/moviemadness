import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../service/auth.js'
import type { Session } from '../service/types.js'
import db from '../service/db.js'

export default async function withAuth(
  req: VercelRequest,
  res: VercelResponse,
  next: (session: Session) => void,
) {
  const session = await auth(req)

  if (!session) {
    return res.status(401).json({ message: 'Access denied' })
  }

  const currentDate = new Date()

  const dif = Math.abs(currentDate.getTime() - session.created_at.getTime())
  function getDays(dif: number) {
    return dif / 1000 / 60 / 60 / 24
  }

  console.log(getDays(dif))

  if (getDays(dif) > 30) {
    await db`delete from sessions where token = ${session.token}`
    res.setHeader('Set-Cookie', [
      `session_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=-1;`,
    ])
    return res.status(401).json({ message: 'Token Expired' })
  }

  next(session)
}
