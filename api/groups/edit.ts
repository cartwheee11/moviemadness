import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import { ResponseBody, GroupMovieAddition } from '../../service/types.js'
import withAuth from '../../middlewares/withAuth.js'
import type { GroupMovieStatusSetting, GroupSettingMovieRating, Rate } from '../../service/types.js'
import { getGroup } from '../../service/groups.js'
import {
  EditGroupRequestBody,
  GetGroupResponseBody,
  GetRatesResponseBody,
} from '../../types/shared.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async ({ user_id }) => {
    const body = req.body as EditGroupRequestBody

    console.log(body.params)

    if (body.params.aim == 'movieAddition') {
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
    } else if (body.params.aim == 'movieStatusSetting') {
      const params = body.params as GroupMovieStatusSetting
      await db`update movies set is_watched = ${params.watched} where id = ${params.movieId}`

      const group = await getGroup(params.groupId, body.page)

      const response: ResponseBody<GetGroupResponseBody> = {
        message: 'success',
        data: group,
      }

      return res.status(200).json(response)
    } else if (body.params.aim == 'settingMovieRating') {
      const params = body.params as GroupSettingMovieRating
      const groupId = body.params.groupId

      await db`insert into rates (user_id, movie_id, group_id, rate, comment)
      values (${user_id}, ${params.movieId}, ${groupId}, ${params.movieRate}, ${params.movieComment})`
      const dbResponse =
        (await db`select * from rates where movie_id = ${params.movieId}`) as Rate[]

      return res.status(200).json({ message: 'success', data: dbResponse })
    }

    const response: ResponseBody<GetRatesResponseBody> = {
      message: 'success',
    }

    res.status(200).json(response)
  })
}
