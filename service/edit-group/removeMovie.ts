import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { EditGroupRequestBody, GetGroupResponseData } from '../../types/contracts.js'
import withAuth from '../../middlewares/withAuth.js'
import { GroupMovieRemoval, ResponseBody } from '../../types/shared.js'
import { getGroup } from '../../service/groups.js'
import db from '../db.js'

export default async function setMovieRating(req: VercelRequest, res: VercelResponse) {
  const body = req.body as EditGroupRequestBody

  withAuth(req, res, async () => {
    const params = body.params as GroupMovieRemoval
    const groupId = body.params.groupId

    await db`delete from movies where id = ${params.movieId}`

    // const response: ResponseBody<Group>
    const dbResponse = await getGroup(groupId, body.page)
    if (!dbResponse) {
      return res.status(422).json({ message: 'group is not defined' })
    }

    const response: ResponseBody<GetGroupResponseData> = {
      message: 'success',
      data: dbResponse,
    }

    return res.status(200).json(response)
  })
}
