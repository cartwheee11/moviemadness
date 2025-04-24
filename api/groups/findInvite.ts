import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import { ResponseBody, Group } from '../../types/shared.js'
import withAuth from '../../middlewares/withAuth.js'
import { FindInviteRequestBody, FindInviteResponseBody } from '../../types/contracts.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async () => {
    const { token } = req.body as FindInviteRequestBody

    const group = (await db`select * from groups where invite_token = ${token}`) as Group[]

    if (!group[0]) {
      return res.status(422).json({ message: 'bad token' } as ResponseBody)
    }

    const response: ResponseBody<FindInviteResponseBody> = {
      message: 'success',
      data: group[0],
    }

    return res.status(200).json(response)
  })
}
