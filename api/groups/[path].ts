// import type { VercelRequest, VercelResponse } from '@vercel/node'
import add from '../../api-handlers/groups/add.js'
import findInvite from '../../api-handlers/groups/findInvite.js'
import getGroup from '../../api-handlers/groups/getGroup.js'
import getProfile from '../../api-handlers/groups/getProfile.js'
import getRates from '../../api-handlers/groups/getRates.js'

import resolveHandlers from '../../service/resolveHandlers.js'

const handlers = { findInvite, getGroup, getProfile, getRates, add }

export default resolveHandlers(handlers)
