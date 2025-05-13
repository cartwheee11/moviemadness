import type { Group, User, Movie, GroupEdition, Rate, Profile } from './shared.js'
import registerRequestBodySchema from '../schemas/shared/registerRequestBodySchema.js'
import type { z } from 'zod'

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
export type RemoveRateRequestBody = { rate_id: string }
export type RegisterRequestBody = z.infer<typeof registerRequestBodySchema>
export type AuthResponseData = Profile
export type RemoveGroupRequestBody = { groupId: string }
// TODO: создать контракты для registerresponse registerrequest
