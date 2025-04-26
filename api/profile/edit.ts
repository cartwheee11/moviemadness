import type { VercelRequest, VercelResponse } from '@vercel/node'
import { EditProfileRequestBody, EditProfileResponseData } from '../../types/contracts.js'
import db from '../../service/db.js'

import { ResponseBody, User } from '../../types/shared.js'
import withAuth from '../../middlewares/withAuth.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  withAuth(req, res, async ({ user_id }) => {
    const { name, avatar } = req.body as EditProfileRequestBody

    const [user] = (await db`
      update users set
      username = COALESCE(${name ? name : null}, username),
      avatar = COALESCE(${avatar ? avatar : null}, avatar)
      WHERE id = ${user_id} returning id, created_at, username, avatar
    `) as User[]

    if (!user) return

    console.log(user)
    const data: EditProfileResponseData = user

    res.json({ message: 'success', data } as ResponseBody<EditProfileResponseData>)
  })
}
