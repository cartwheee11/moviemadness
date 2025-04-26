import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import { ResponseBody } from '../../types/shared.js'
import withAuth from '../../middlewares/withAuth.js'
import { getGroup } from '../../service/groups.js'
import type { GetGroupRequestBody, GetGroupResponseData } from '../../types/contracts.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async (session) => {
    const body = req.body as GetGroupRequestBody

    const arr =
      await db`select * from users_groups where user_id = ${session.user_id} and group_id = ${body.groupId}`

    if (!arr.length) {
      res.status(403).json({ type: 'error', message: 'user isnt a member of that group' })
      return
    }

    const data = await getGroup(body.groupId, body.page)

    const response: ResponseBody<GetGroupResponseData> = {
      message: 'success',
      data: data,
    }

    res.status(200).json(response)
  })
}
