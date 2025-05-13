import type { VercelRequest, VercelResponse } from '@vercel/node'
import withAuth from '../../middlewares/withAuth.js'
import db from '../../service/db.js'
import { AuthResponseData } from '../../types/contracts.js'
import { Profile, ResponseBody } from '../../types/shared.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async ({ user_id }) => {
    // await db`delete from sessions where user_id = ${user_id} and token = ${token}`
    const data =
      (await db`select id, username, avatar, created_at from users where id = ${user_id}`) as Profile[]

    const profile = data[0]

    const response: ResponseBody<AuthResponseData> = {
      message: 'success',
      data: profile,
    }

    res.status(200).json(response)
  })
}
