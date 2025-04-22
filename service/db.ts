import pg from 'postgres'
const db = pg(process.env.POSTGRES_URL as string)
export default db
