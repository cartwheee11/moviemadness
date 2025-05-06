import type { VercelRequest, VercelResponse } from '@vercel/node'

type ApiHandler = (req: VercelRequest, res: VercelResponse) => void

export default function resolveHandlers(handlers: Record<string, ApiHandler>) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    if (!req.query.path || typeof req.query.path != 'string') {
      return res.status(404).end()
    }

    const handler = handlers[req.query.path]

    console.log(req.query.path, handlers[req.query.path])

    if (!handler) {
      return res.status(404).json({ message: 'не найден обработчик по заданному пути' })
    }

    return handler(req, res)
  }
}
