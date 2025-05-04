import type { VercelRequest, VercelResponse } from '@vercel/node'
import editProfile from '../../api-handlers/profile/edit.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  switch (req.query['path']) {
    case 'edit':
      console.log('case edit')
      await editProfile(req, res)
      break
    default:
      console.log('case default')
      res.status(404).end()
  }
}
