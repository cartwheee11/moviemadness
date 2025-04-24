import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { EditGroupRequestBody, GetGroupResponseBody } from '../../types/contracts.js'
import withAuth from '../../middlewares/withAuth.js'
import { GroupMovieAddition, ResponseBody } from '../../types/shared.js'
import { getGroup } from '../groups.js'
import db from '../db.js'

export default async function setMovieStatus(req: VercelRequest, res: VercelResponse) {
  const body = req.body as EditGroupRequestBody

  withAuth(req, res, async ({ user_id }) => {
    const params = body.params as GroupMovieAddition

    console.log(body)

    await db`
          INSERT INTO movies (name, "desc", user_id, group_id)
          values (${params.movieName}, ${params.movieDesc}, ${user_id}, ${params.groupId})
      `

    const group = await getGroup(params.groupId, body.page)

    const response: ResponseBody<GetGroupResponseBody> = {
      message: 'success',
      data: group,
    }

    return res.status(200).json(response)
  })
}
