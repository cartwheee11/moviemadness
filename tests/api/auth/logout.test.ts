import { it, expect, inject } from 'vitest'
const auth = inject('auth')
const { cookie } = auth

it('logout: should respond with 200 success', async () => {
  const response = await fetch('http://localhost:3000/api/auth/logout', {
    headers: {
      Cookie: cookie,
    },
  })

  expect(response.status).toBe(200)
})
