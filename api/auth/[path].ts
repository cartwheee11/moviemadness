import type { VercelRequest, VercelResponse } from '@vercel/node'
import login from '../../api-handlers/auth/login.js'
import register from '../../api-handlers/auth/register.js'
import logout from '../../api-handlers/auth/logout.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  switch (req.query['path']) {
    case 'login':
      await login(req, res)
      break
    case 'register':
      await register(req, res)
      break
    case 'logout':
      await logout(req, res)
      break
    default:
      res.status(404).end()
  }
}
