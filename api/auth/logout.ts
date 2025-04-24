import type { VercelRequest, VercelResponse } from '@vercel/node'
import withAuth from '../../middlewares/withAuth.js'
import db from '../../service/db.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async ({ user_id, token }) => {
    res.setHeader('Set-Cookie', [
      `session_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=-1;`,
    ])

    await db`delete from sessions where user_id = ${user_id} and token = ${token}`

    res.json({ type: 'success' })
  })
}
