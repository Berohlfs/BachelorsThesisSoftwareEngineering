// Libs
import z from 'zod'

export const register_validation = z.object({
    email: z.string().email('Inválido'),
    password: z.string().min(8, 'Ao menos 8 caracteres'),
    confirm_password: z.string().min(8, 'Ao menos 8 caracteres')
}).refine(data=> data.confirm_password === data.password, {
    message: 'Confirmação de senha incorreta',
    path: ['confirm_password']
})

export const register_default_values = {
    email: '',
    password: '',
    confirm_password: ''
}