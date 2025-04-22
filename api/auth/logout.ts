import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('Set-Cookie', [
    `session_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=-1;`,
  ])

  res.json({ type: 'success' })
}
