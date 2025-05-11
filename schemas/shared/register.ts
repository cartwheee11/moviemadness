import { z } from 'zod'

export default z
  .object({
    username: z
      .string({ required_error: 'Поле не должно быть пустым' })
      .min(6, { message: 'Никнейм должен иметь как минимум 6 символов' })
      .max(30, { message: 'Никнейм может иметь максимум 30 символов' })
      .nonempty(),
    pass: z
      .string({ required_error: 'Поле не должно быть пустым' })
      .min(6, { message: 'Пароль должен иметь как минимум 6 символов' })
      .nonempty()
      .max(72, { message: 'Пароль может иметь максимум 72 символа' }),
    confirmPass: z.string({ required_error: 'Поле не должно быть пустым' }).nonempty(),
  })
  .refine((data) => data.confirmPass === data.pass, {
    path: ['confirmPass'],
    message: 'Пароли не совпадают',
  })
