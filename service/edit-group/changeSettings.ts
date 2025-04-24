import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { EditGroupRequestBody, GetGroupResponseBody } from '../../types/contracts.js'
import withUserInGroup from '../../middlewares/withUserInGroup.js'
import { GroupChangingSettings, ResponseBody } from '../../types/shared.js'
import db from '../db.js'
import { getGroup } from '../groups.js'

export default async function setMovieRating(req: VercelRequest, res: VercelResponse) {
  const body = req.body as EditGroupRequestBody
  const groupId = body.params.groupId
  withUserInGroup(req, res, groupId, async () => {
    const params = body.params as GroupChangingSettings
    const groupId = body.params.groupId

    console.log(params)

    await db`
      update groups set
        name = COALESCE(${params.name ? params.name : null}, name),
        "desc" = COALESCE(${params.about ? params.about : null}, "desc"),
        avatar_url = COALESCE(${params.avatarUrl ? params.avatarUrl : null}, avatar_url)
      WHERE id = ${groupId}
    `

    const group = await getGroup(groupId, body.page)

    const response: ResponseBody<GetGroupResponseBody> = {
      message: 'success',
      data: group,
    }

    return res.status(200).json(response)
  })
}
