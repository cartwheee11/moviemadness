import { z } from 'zod'

import {
  MAX_USERNAME_LEN,
  MIN_USERNAME_LEN,
  MAX_PASS_LEN,
  MIN_PASS_LEN,
} from '../../constants/shared.js'

export default z.object({
  username: z
    .string({ required_error: 'Поле не должно быть пустым' })
    .min(MIN_USERNAME_LEN, { message: 'Никнейм должен иметь как минимум 6 символов' })
    .max(MAX_USERNAME_LEN, { message: 'Никнейм может иметь максимум 30 символов' })
    .nonempty(),
  pass: z
    .string({ required_error: 'Поле не должно быть пустым' })
    .min(MIN_PASS_LEN, { message: 'Пароль должен иметь как минимум 6 символов' })
    .nonempty()
    .max(MAX_PASS_LEN, { message: 'Пароль может иметь максимум 72 символа' }),
})
