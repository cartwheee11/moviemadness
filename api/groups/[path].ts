import add from '../../api-handlers/groups/add.js'
import findInvite from '../../api-handlers/groups/findInvite.js'
import getGroup from '../../api-handlers/groups/getGroup.js'
import getProfile from '../../api-handlers/groups/getProfile.js'
import getRates from '../../api-handlers/groups/getRates.js'
import removeRate from '../../api-handlers/groups/removeRate.js'

import resolveHandlers from '../../service/resolveHandlers.js'

const handlers = { findInvite, getGroup, getProfile, getRates, add, removeRate }

export default resolveHandlers(handlers)
