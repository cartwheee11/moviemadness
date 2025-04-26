import type { Group, User, Movie, GroupEdition, Rate } from './shared.js'

export type GetGroupResponseBody = { group: Group; members: User[]; movies: Movie[] }
export type GetGroupRequiesBody = { groupId: string; page: number }
export type EditGroupRequestBody = { params: GroupEdition; page: number }
export type GetRatesRequestBody = { movieId: string }
export type GetRatesResponseBody = Rate[]
export type LoginRequiestBody = { username: string; pass: string }
export type FindInviteRequestBody = { token: string }
export type FindInviteResponseBody = Group
export type EditProfileRequestBody = { name: string; avatar: string }
export type EditProfileResponseData = User
