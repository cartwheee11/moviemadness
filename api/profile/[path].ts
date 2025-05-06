import edit from '../../api-handlers/profile/edit.js'
import resolveHandlers from '../../service/resolveHandlers.js'

const handlers = { edit }

export default resolveHandlers(handlers)

// export default async function (req: VercelRequest, res: VercelResponse) {
//   switch (req.query['path']) {
//     case 'edit':
//       console.log('case edit')
//       await editProfile(req, res)
//       break
//     default:
//       console.log('case default')
//       res.status(404).end()
//   }
// }
