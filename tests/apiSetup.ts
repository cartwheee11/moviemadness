import { TestProject } from 'vitest/node'
import dotenv from 'dotenv'
import pg from 'postgres'
dotenv.config()

const db = pg(process.env.POSTGRES_URL as string)

const user = {
  username: '1235322390852390223585902358',
  pass: '023578023915780239578230975',
}

// регистрирую пользователя
const response = await fetch('http://localhost:3000/api/auth/register', {
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'post',
  body: JSON.stringify(user),
})

const cookie = response.headers.get('Set-Cookie') || ''

const data = {
  user,
  cookie,
} as const

export default async function setup({ provide }: TestProject) {
  provide('auth', data)

  return async () => {
    console.log('TEARDOWN удаляем глобального пользователя')
    await db`delete from users where username = ${user.username}`
  }
}

declare module 'vitest' {
  export interface ProvidedContext {
    auth: typeof data
  }
}
