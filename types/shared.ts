export interface Auth {
  username: string
}

export interface Row {
  id: string
  created_at: Date | string
}

export interface Session extends Row {
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
  aim: 'movieAddition'
}

export interface GroupMemberAddition extends GroupEditionBase {
  token: string
  aim: 'memberAddition'
}

export interface GroupMovieRemoval extends GroupEditionBase {
  movieId: string
  aim: 'movieRemoval'
}

export interface GroupSettingMovieRating extends GroupEditionBase {
  movieId: string
  movieRate: string
  movieComment: string
  aim: 'settingMovieRating'
}

export interface GroupSettingMovieStatus extends GroupEditionBase {
  movieId: string
  watched: boolean
  aim: 'settingMovieStatus'
}

export interface GroupChangingSettings extends GroupEditionBase {
  aim: 'changingSettings'
  name?: string
  avatarUrl?: string | null
  about?: string
}

export type GroupEdition =
  | GroupSettingMovieStatus
  | GroupSettingMovieRating
  | GroupMovieAddition
  | GroupMovieRemoval
  | GroupChangingSettings
  | GroupMemberAddition

export interface ResponseBody<T = void> {
  message: string
  data?: T
}

export interface Movie extends Row {
  name: string
}

export interface Group extends Row {
  name: string
  avatar_url: string | null
  desc: string
  movies_count: string
  invite_token: string
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
