import db from './db.js'
import type { VercelRequest } from '@vercel/node'
import type { Session } from '../service/types.js'

export async function auth(req: VercelRequest) {
  const token = req.cookies.session_token as string | undefined
  if (!token) {
    return false
  }

  const sessions = await db`select * from sessions where token = ${token}`
  if (!sessions.length) {
    return false
  }

  return sessions[0] as Session
}

export async function createSession(userId: string, req: VercelRequest) {
  const userAgent = req.headers['user-agent']
  const ipAddress = req.socket.remoteAddress

  const sessions = await db`
    insert into sessions(user_id, user_agent, ip_address)
    values (${userId}, ${userAgent || null}, ${ipAddress || null}) returning *
  `
  return sessions[0] as Session
}
