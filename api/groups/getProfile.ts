import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import withAuth from '../../middlewares/withAuth.js'
import type { ResponseBody, Group, Profile } from '../../service/types.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  await withAuth(req, res, async (session) => {
    const groups = (await db`
    SELECT g.*
    FROM groups g
    INNER JOIN users_groups ug ON g.id = ug.group_id
    WHERE ug.user_id = ${session.user_id};
  `) as Group[]

    const [user] =
      (await db`select id, username, created_at, avatar from users where id = ${session.user_id}`) as Profile[]

    res.json({ message: 'success', data: { groups, user } } as ResponseBody<{
      groups: Group[]
      user: Profile
    }>)
  })
}
