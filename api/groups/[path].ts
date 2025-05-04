import type { VercelRequest, VercelResponse } from '@vercel/node'
import add from '../../api-handlers/groups/add.js'
import findInvite from '../../api-handlers/groups/findInvite.js'
import getGroup from '../../api-handlers/groups/getGroup.js'
import getProfile from '../../api-handlers/groups/getProfile.js'
import getRates from '../../api-handlers/groups/getRates.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  switch (req.query['path']) {
    case 'add':
      await add(req, res)
      break
    case 'findInvite':
      await findInvite(req, res)
      break
    case 'getGroup':
      await getGroup(req, res)
      break
    case 'getProfile':
      await getProfile(req, res)
      break
    case 'getRates':
      await getRates(req, res)
      break
    default:
      res.status(404).end()
  }
}
