import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import { ResponseBody } from '../../service/types.js'
import withAuth from '../../middlewares/withAuth.js'
import { getGroup } from '../../service/groups.js'
import type { GetGroupRequiesBody, GetGroupResponseBody } from '../../types/shared.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async (session) => {
    const body = req.body as GetGroupRequiesBody

    const arr =
      await db`select * from users_groups where user_id = ${session.user_id} and group_id = ${body.groupId}`

    if (!arr.length) {
      res.status(403).json({ type: 'error', message: 'user isnt a member of that group' })
      return
    }

    const data = await getGroup(body.groupId, body.page)

    const response: ResponseBody<GetGroupResponseBody> = {
      message: 'success',
      data: data,
    }

    res.status(200).json(response)
  })
}
