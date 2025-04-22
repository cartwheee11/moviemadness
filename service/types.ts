// import type { VercelRequest } from '@vercel/node'

export interface Auth {
  username: string
}

export interface Session {
  token: string
  user_id: string
  created_at: Date
  ip_address: string
  user_agent: string
}

export interface Movie extends Row {
  name: string
  desc: string
  is_watched: boolean
  user_id: string
}

export interface Rate extends Row {
  user_id: string
  movie_id: string
  comment: string
  rate: number
}

export interface GroupEditionBase {
  groupId: string
  aim: string
}

export interface GroupMovieAddition extends GroupEditionBase {
  movieName: string
  movieDesc: string
}

export interface GroupSettingMovieRating extends GroupEditionBase {
  movieId: string
  movieRate: string
  movieComment: string
}

export interface GroupMovieStatusSetting extends GroupEditionBase {
  movieId: string
  watched: boolean
}

export type GroupEdition = GroupMovieStatusSetting | GroupSettingMovieRating | GroupMovieAddition

export interface ResponseBody<T = void> {
  message: string
  data?: T
}

export function isAuth(a: unknown): a is Auth {
  if (typeof a != 'object' || !a) {
    return false
  }

  if (!('username' in a) || !('pass' in a)) {
    return false
  }

  if (typeof a.username != 'string' || typeof a.pass != 'string') {
    return false
  }

  return true
}

export interface Row {
  id: string
  created_at: Date | string
}

export interface Movie extends Row {
  name: string
}

export interface Group extends Row {
  name: string
  avatar_url: string | null
  desc: string
  movies_count: string
}

export interface User extends Row {
  username: string
  pass: string
  avatar: string | null
}

export interface Profile extends Row {
  username: string
  avatar: string | null
}
