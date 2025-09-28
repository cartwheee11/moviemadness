import { it, expect, afterAll } from 'vitest'
import { inject } from 'vitest'
import dotenv from 'dotenv'
import pg from 'postgres'
import type { ResponseBody } from 'types/shared.js'
dotenv.config()

const db = pg(process.env.POSTGRES_URL as string)

const { user } = inject('auth')

const fakeUser = {
  username: '123478192874128974128974',
  pass: '01239587120581295812095823408956823409658',
}

it('register: should respond with 200 success and return session in cookies', async () => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(fakeUser),
  })

  expect(response.status).toBe(200)

  const data = (await response.json()) as ResponseBody
  expect(data.message).toBe('success')

  const accessCookie = response.headers.get('Set-Cookie') || ''
  const sessionToken = accessCookie.split(';')[0]?.split('=')[1]
  expect(sessionToken).toBeDefined()
  expect(accessCookie).toBeDefined()
})

it('register: should unable to register user with the same username 409 CONFLICT', async () => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(user),
  })
  const data = (await response.json()) as ResponseBody
  expect(response.status).toBe(409)
  expect(data.message).toBeDefined()
})

afterAll(async () => {
  console.log('afterAll УДАЛЯЕМ ПОЛЬЗОВАТЕЛЯ ИЗ БАЗЫ ДАННЫХ если он остался')
  await db`delete from users where username = ${fakeUser.username}`
})
