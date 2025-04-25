// const baseURL = import.meta.env.BASE_URL
import router from './router'

import type {
  Group,
  ResponseBody,
  GroupEdition,
  Profile,
  GroupSettingMovieRating,
  GroupMemberAddition,
} from '../types/shared'

import type {
  EditGroupRequestBody,
  FindInviteRequestBody,
  FindInviteResponseBody,
  GetGroupRequiesBody,
  GetGroupResponseBody,
  GetRatesRequestBody,
  GetRatesResponseBody,
  LoginRequiestBody,
} from '../types/contracts'

const baseURL = ''
import { useAuth } from './stores/auth'

export type Auth = { username: string; pass: string }

async function fetchWithMiddleware(url: string, opts: RequestInit) {
  const res = fetch(url, opts)

  res.then(({ status }) => {
    if (status == 401) {
      const auth = useAuth()

      router.push('/auth/login')
      auth.removeAuth()
    }
  })

  return res
}

export async function register(username: string, pass: string) {
  const { setAuth } = useAuth()
  const res = await fetch(baseURL + '/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, pass }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  const data = (await res.json()) as Record<string, string | Auth>
  if (data.type == 'success') {
    const auth = data.auth as Auth
    setAuth(auth)
  }

  return await data
}

export async function logout() {
  const { removeAuth } = useAuth()
  const res = await fetch(baseURL + '/api/auth/logout', {
    method: 'post',
    credentials: 'include',
  })

  console.log(res)

  removeAuth()
  return res
}

export async function login(username: string, pass: string) {
  const reuqiest: LoginRequiestBody = {
    username,
    pass,
  }

  const { setAuth } = useAuth()
  const res = await fetch(baseURL + '/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(reuqiest),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  const data = (await res.json()) as Record<string, string | Auth>
  if (data.type == 'success') {
    const auth = data.auth as Auth
    setAuth(auth)
  }

  return data
}

export async function getProfile() {
  const res = await fetchWithMiddleware(baseURL + '/api/groups/getProfile', {
    credentials: 'include',
    method: 'GET',
  })

  console.log(res)

  const data: ResponseBody<{ groups: Group[]; user: Profile }> = await res?.json()
  console.log(data)
  return data
}

export async function createGroup(name: string) {
  const res = await fetchWithMiddleware(baseURL + '/api/groups/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ name }),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody<Group>

  return data
}

export async function getGroup(groupId: string, page: number) {
  const requiesBody: GetGroupRequiesBody = {
    groupId,
    page,
  }

  const res = await fetchWithMiddleware(baseURL + '/api/groups/getGroup', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(requiesBody),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody<GetGroupResponseBody>

  return data
}

export async function editGroup(params: GroupEdition, page: number) {
  const request: EditGroupRequestBody = {
    params,
    page,
  }

  const res = await fetchWithMiddleware(baseURL + '/api/groups/edit', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody<GetGroupResponseBody>

  console.log(data)

  return data
}

export async function setMovieRate(
  movieId: string,
  movieComment: string,
  movieRate: string,
  groupId: string,
) {
  const params: GroupSettingMovieRating = {
    movieId,
    movieComment,
    movieRate,
    groupId,
    aim: 'settingMovieRating',
  }

  const res = await fetchWithMiddleware(baseURL + '/api/groups/edit', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ params, page: 0 }),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody<GetRatesResponseBody>

  return data
}

export async function getRates(movieId: string) {
  const request: GetRatesRequestBody = {
    movieId,
  }

  const res = await fetchWithMiddleware(baseURL + '/api/groups/getRates', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody<GetRatesResponseBody>

  return data
}

export async function findInvite(token: string) {
  const request: FindInviteRequestBody = {
    token,
  }

  try {
    const res = await fetch(baseURL + '/api/groups/findInvite', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(request),
      credentials: 'include',
    })

    const data = (await res.json()) as ResponseBody<FindInviteResponseBody>

    return data
  } catch (e) {
    console.log(e)
  }
}

export async function acceptInvite(token: string, groupId: string) {
  const params: GroupMemberAddition = {
    aim: 'memberAddition',
    groupId,
    token,
  }

  const res = await fetchWithMiddleware(baseURL + '/api/groups/edit', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ params, page: 0 }),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody

  return data
}
