import login from '../../api-handlers/auth/login.js'
import register from '../../api-handlers/auth/register.js'
import logout from '../../api-handlers/auth/logout.js'
import resolveHandlers from '../../service/resolveHandlers.js'

const handlers = { login, register, logout }

export default resolveHandlers(handlers)
