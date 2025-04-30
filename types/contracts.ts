import type { Group, User, Movie, GroupEdition, Rate } from './shared.js'

export type GetGroupResponseData = { group: Group; members: User[]; movies: Movie[] }
export type GetGroupRequestBody = { groupId: string; page: number }
export type EditGroupRequestBody = { params: GroupEdition; page: number }
export type GetRatesRequestBody = { movieId: string }
export type GetRatesResponseData = Rate[]
export type LoginRequestBody = { username: string; pass: string }
export type LoginResponseData = { auth: { username: string } }
export type FindInviteRequestBody = { token: string }
export type FindInviteResponseData = Group
export type EditProfileRequestBody = { name: string; avatar: string }
export type EditProfileResponseData = User

// TODO: создать контракты для registerresponse
