import login from '../../api-handlers/auth/login.js'
import register from '../../api-handlers/auth/register.js'
import logout from '../../api-handlers/auth/logout.js'
import resolveHandlers from '../../service/resolveHandlers.js'
import auth from '../../api-handlers/auth/auth.js'

const handlers = { login, register, logout, auth }

export default resolveHandlers(handlers)
