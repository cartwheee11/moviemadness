import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import { ResponseBody, Rate } from '../../service/types.js'
import withAuth from '../../middlewares/withAuth.js'
// import type { GroupMovieStatusSetting } from '../../service/types.js'
// import { getGroup } from '../../service/groups.js'
import { GetRatesRequestBody, GetRatesResponseBody } from '../../types/shared.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async () => {
    const body = req.body as GetRatesRequestBody

    const id = body.movieId

    const dbResponse = (await db`select * from rates where movie_id = ${id}`) as Rate[]

    const response: ResponseBody<GetRatesResponseBody> = {
      message: 'success',
      data: dbResponse,
    }

    res.status(200).json(response)
  })
}
