import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { EditGroupRequestBody } from '../../types/contracts.js'
import withAuth from '../../middlewares/withAuth.js'
import { Group, GroupMemberAddition, ResponseBody } from '../../types/shared.js'
import db from '../db.js'

export default async function setMovieStatus(req: VercelRequest, res: VercelResponse) {
  const body = req.body as EditGroupRequestBody

  withAuth(req, res, async ({ user_id }) => {
    const { token } = body.params as GroupMemberAddition
    console.log(body)

    const groups = (await db`select * from groups where invite_token = ${token}`) as Group[]
    if (!groups[0]) {
      return res
        .status(422)
        .json({ message: 'группы с таким токеном не существует' } as ResponseBody)
    }

    const groupId = groups[0].id

    await db`
      insert into users_groups (user_id, group_id) values (${user_id}, ${groupId})
    `

    return res.status(200).json({ message: 'success' } as ResponseBody)
  })
}
