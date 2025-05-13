// const router = useRouter()
import router from '../src/router/index.js'

import type {
  Group,
  ResponseBody,
  GroupEdition,
  Profile,
  GroupSettingMovieRating,
  GroupMemberAddition,
} from '../types/shared'

import type {
  AuthResponseData,
  EditGroupRequestBody,
  EditProfileRequestBody,
  EditProfileResponseData,
  FindInviteRequestBody,
  FindInviteResponseData,
  GetGroupRequestBody,
  GetGroupResponseData,
  GetRatesRequestBody,
  GetRatesResponseData,
  LoginRequestBody,
  LoginResponseData,
  RemoveRateRequestBody,
} from '../types/contracts'

const baseURL = ''

async function fetchWithMiddleware(url: string, opts: RequestInit) {
  const res = fetch(url, opts)

  res.then(({ status }) => {
    if (status == 401) {
      router.push('/auth/login')
    }
  })

  return res
}

export async function register(username: string, pass: string) {
  // const { setAuth } = useAuth()
  const res = await fetch(baseURL + '/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, pass }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody
  // if (data.type == 'success') {
  //   const auth = data.auth as Auth
  //   setAuth(auth)
  // }

  return await data
}

export async function auth() {
  const res = await fetch(baseURL + '/api/auth/auth', {
    method: 'post',
    credentials: 'include',
  })

  return res as Omit<Response, 'json'> & { json: () => Promise<ResponseBody<AuthResponseData>> }
}

export async function logout() {
  // const { removeAuth } = useAuth()
  const res = await fetch(baseURL + '/api/auth/logout', {
    method: 'post',
    credentials: 'include',
  })

  // removeAuth()
  return res
}

export async function login(username: string, pass: string) {
  const reuqiest: LoginRequestBody = {
    username,
    pass,
  }

  const res = await fetch(baseURL + '/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(reuqiest),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  const body = (await res.json()) as ResponseBody<LoginResponseData>

  return body
}

export async function getProfile() {
  const res = await fetchWithMiddleware(baseURL + '/api/groups/getProfile', {
    credentials: 'include',
    method: 'GET',
  })

  const data: ResponseBody<{ groups: Group[]; user: Profile }> = await res?.json()

  return data
}

export async function removeGroup(groupId: string) {
  const res = await fetchWithMiddleware(baseURL + '/api/groups/remove', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ groupId }),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody

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
  const requiesBody: GetGroupRequestBody = {
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

  const data = (await res.json()) as ResponseBody<GetGroupResponseData>

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

  const data = (await res.json()) as ResponseBody<GetGroupResponseData>

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

  const data = (await res.json()) as ResponseBody<GetRatesResponseData>

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

  const data = (await res.json()) as ResponseBody<GetRatesResponseData>

  return data
}

export async function findInvite(token: string) {
  const request: FindInviteRequestBody = {
    token,
  }

  const res = await fetch(baseURL + '/api/groups/findInvite', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody<FindInviteResponseData>

  return data
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

export async function editProfile(params: { name: string; avatar: string }) {
  const request: EditProfileRequestBody = params

  const res = await fetchWithMiddleware(baseURL + '/api/profile/edit', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody<EditProfileResponseData>

  return data
}

export async function removeRate(rateId: string) {
  console.log(rateId)
  const request: RemoveRateRequestBody = {
    rate_id: rateId,
  }

  const res = await fetchWithMiddleware(baseURL + '/api/groups/removeRate', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  const data = (await res.json()) as ResponseBody

  return data
}

// TODO: удаление группы (только если создатель группы)
// TODO: смена пароля
// TODO: убрать взаимодействия со сторой как сайд эфект (фетчинг данных должен происходить через стору)
