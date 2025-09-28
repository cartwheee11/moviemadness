import pg from 'postgres'
const db = pg(process.env.POSTGRES_URL as string)
// console.log(process.env.POSTGRES_URL)
export default db
