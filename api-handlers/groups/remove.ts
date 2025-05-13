import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import withAuth from '../../middlewares/withAuth.js'
import type { RemoveGroupRequestBody } from '../../types/contracts.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  await withAuth(req, res, async ({ user_id }) => {
    const { groupId } = req.body as RemoveGroupRequestBody

    const result = await db`delete from groups where id = ${groupId} and creator = ${user_id}`

    console.log(result.count)

    if (!result.count) {
      return res.status(403).json({ message: 'отказано в доступе' })
    }

    return res.status(200).json({ message: 'success' })
  })
}
