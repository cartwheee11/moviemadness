import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { EditGroupRequestBody, GetGroupResponseData } from '../../types/contracts.js'
import withAuth from '../../middlewares/withAuth.js'
import { GroupSettingMovieStatus, ResponseBody } from '../../types/shared.js'
import { getGroup } from '../groups.js'
import db from '../db.js'

export default async function setMovieStatus(req: VercelRequest, res: VercelResponse) {
  const body = req.body as EditGroupRequestBody

  console.log('зашли в функцию')

  withAuth(req, res, async () => {
    const params = req.body.params as GroupSettingMovieStatus

    await db`update movies set is_watched = ${params.watched} where id = ${params.movieId}`

    const group = await getGroup(params.groupId, body.page)

    const response: ResponseBody<GetGroupResponseData> = {
      message: 'success',
      data: group,
    }

    return res.status(200).json(response)
  })
}
