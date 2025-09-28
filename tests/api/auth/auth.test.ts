import { it, expect, inject } from 'vitest'
import type { LoginResponseData } from '../../../types/contracts.js'
import { ResponseBody } from 'types/shared.js'
const { user } = inject('auth')

it('auth: should respond with 409 unauthorized', async () => {
  const response = await fetch('http://localhost:3000/api/auth/auth')
  const data = (await response.json()) as ResponseBody
  expect(data.message).toBe('Access denied')
  expect(response.status).toBe(401)
})

it('login: should login into a new acc', async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(user),
  })

  const data = (await response.json()) as ResponseBody<LoginResponseData>

  expect(response.status).toBe(200)
  expect(data.message).toBe('success')
  const accessCookie = response.headers.get('Set-Cookie') || ''
  const sessionToken = accessCookie.split(';')[0]?.split('=')[1]
  expect(sessionToken).toBeDefined()
  expect(accessCookie).toBeDefined()
})

// it('logout: should respond with 200 success', async () => {
//   const response = await fetch('http://localhost:3000/api/auth/logout', {
//     headers: {
//       Cookie: accessCookie,
//     },
//   })

//   expect(response.status).toBe(200)
// })
