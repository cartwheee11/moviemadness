import type { VercelRequest, VercelResponse } from '@vercel/node'
import { EditGroupRequestBody } from '../../types/contracts.js'

//TODO: поменять на динамический роутинг как в случае с auth и profile
//TODO: поменять типы редактирования а ля addMovie на контракты эндпоинтов
import setMovieStatus from '../../service/edit-group/setMovieStatus.js'
import setMovieRating from '../../service/edit-group/setMovieRating.js'
import addMovie from '../../service/edit-group/addMovie.js'
import removeMovie from '../../service/edit-group/removeMovie.js'
import changeSettings from '../../service/edit-group/changeSettings.js'
import addMember from '../../service/edit-group/addMember.js'
import { ResponseBody } from '../../types/shared.js'

export default async function (req: VercelRequest, res: VercelResponse) {
  const body = req.body as EditGroupRequestBody

  console.log(body.params)

  if (body.params.aim == 'movieAddition') {
    await addMovie(req, res)
  } else if (body.params.aim == 'settingMovieStatus') {
    await setMovieStatus(req, res)
  } else if (body.params.aim == 'settingMovieRating') {
    await setMovieRating(req, res)
  } else if (body.params.aim == 'movieRemoval') {
    await removeMovie(req, res)
  } else if (body.params.aim == 'changingSettings') {
    await changeSettings(req, res)
  } else if (body.params.aim == 'memberAddition') {
    await addMember(req, res)
  } else {
    const response: ResponseBody = {
      message: 'invalid body data',
    }
    res.status(422).json(response)
  }
}
