import type { Group, User, Movie, GroupEdition, Rate } from '../service/types.js'

export type GetGroupResponseBody = { group: Group; members: User[]; movies: Movie[] }
export type GetGroupRequiesBody = { groupId: string; page: number }
export type EditGroupRequestBody = { params: GroupEdition; page: number }
export type GetRatesRequestBody = { movieId: string }
export type GetRatesResponseBody = Rate[]
