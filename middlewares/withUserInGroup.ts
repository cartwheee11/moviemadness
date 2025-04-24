import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { ResponseBody, Session } from '../types/shared.js'
import db from '../service/db.js'
import withAuth from './withAuth.js'

export default async function withUserInGroup(
  req: VercelRequest,
  res: VercelResponse,
  groupId: string,
  next: (session: Session) => void,
) {
  withAuth(req, res, async (session) => {
    const [relation] =
      await db`select * from users_groups where user_id = ${session.user_id} and group_id = ${groupId}`

    console.log(relation)
    if (!relation) {
      return res.status(422).json({ message: 'пользователь не найден' } as ResponseBody)
    }

    return next(session)
  })
}
