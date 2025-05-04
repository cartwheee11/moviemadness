import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import { ResponseBody, Rate } from '../../types/shared.js'
import withAuth from '../../middlewares/withAuth.js'

import { GetRatesRequestBody, GetRatesResponseData } from '../../types/contracts.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async () => {
    const body = req.body as GetRatesRequestBody

    const id = body.movieId

    const dbResponse = (await db`select * from rates where movie_id = ${id}`) as Rate[]

    const response: ResponseBody<GetRatesResponseData> = {
      message: 'success',
      data: dbResponse,
    }

    res.status(200).json(response)
  })
}
