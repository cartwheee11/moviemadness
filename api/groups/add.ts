import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../../service/db.js'
import withAuth from '../../middlewares/withAuth.js'
import { ResponseBody } from '../../service/types.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  await withAuth(req, res, async (session) => {
    const body = req.body as unknown

    if (!(body instanceof Object)) {
      res.json({ type: 'error', message: 'body is not an object' })
      return
    }

    if (!('name' in body) || typeof body.name != 'string') {
      res.json({ type: 'error', message: 'group no name' })
      return
    }

    const { name } = body

    if (!name) {
      res.json({ type: 'error', message: 'имя группы не может быть пустым' })
      return
    }

    await db`
      with new_group as (
        insert into groups (name) values (${name})
        returning id
      )

      insert into users_groups (user_id, group_id) values (${session.user_id}, (select id from new_group))
    `

    res.status(200).json({ message: 'success' } as ResponseBody)
  })
}
