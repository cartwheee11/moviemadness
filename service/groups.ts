import db from './db.js'
import { Group, User, Movie } from './types.js'
import { PAGE_LIMIT } from '../constants/shared.js'

export async function getGroup(groupId: string, page: number) {
  const members = (await db`
    SELECT u.id, u.username
    FROM users u
    JOIN users_groups ug ON u.id = ug.user_id
    WHERE ug.group_id = ${groupId};
  `) as User[]

  const [group] = (await db`select * from groups where id = ${groupId}`) as Group[]

  const movies =
    (await db`select * from movies where group_id = ${groupId} order by id desc limit ${PAGE_LIMIT} offset ${(page - 1) * PAGE_LIMIT}`) as Movie[]

  const [{ count }] = await db`select count(*) from movies where group_id = ${groupId}`
  group.movies_count = count

  const response: { group: Group; members: User[]; movies: Movie[] } = { group, members, movies }

  return response
}
