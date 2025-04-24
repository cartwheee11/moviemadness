import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { EditGroupRequestBody } from '../../types/contracts.js'
import withAuth from '../../middlewares/withAuth.js'
import { GroupSettingMovieRating, Rate } from '../../types/shared.js'
import db from '../db.js'

export default async function setMovieRating(req: VercelRequest, res: VercelResponse) {
  const body = req.body as EditGroupRequestBody

  console.log('зашли в функцию')

  withAuth(req, res, async ({ user_id }) => {
    const params = body.params as GroupSettingMovieRating
    const groupId = body.params.groupId

    await db`insert into rates (user_id, movie_id, group_id, rate, comment)
      values (${user_id}, ${params.movieId}, ${groupId}, ${params.movieRate}, ${params.movieComment})`
    const dbResponse = (await db`select * from rates where movie_id = ${params.movieId}`) as Rate[]

    return res.status(200).json({ message: 'success', data: dbResponse })
  })
}
