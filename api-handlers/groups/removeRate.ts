import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import { Rate, ResponseBody } from '../../types/shared.js'
import withAuth from '../../middlewares/withAuth.js'

import { RemoveRateRequestBody } from '../../types/contracts.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async ({ user_id }) => {
    const { rate_id } = req.body as RemoveRateRequestBody

    const rates =
      (await db`select * from rates where id = ${rate_id} and user_id = ${user_id}`) as Rate[]

    if (!rates[0]) {
      return res.status(404).json({ message: 'комментарий не найден' } as ResponseBody)
    }

    await db`delete from rates where id = ${rate_id}`

    return res.status(200).json({ message: 'success' } as ResponseBody)
  })
}
