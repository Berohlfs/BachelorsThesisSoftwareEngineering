// Libs
import z from 'zod'

export const create_staff_validation = z.object({
    full_name: z.string().min(5, 'Mínimo 5 caracteres'),
    username: z.string().min(5, 'Mínimo 5 caracteres'),
    password: z.string().min(5, 'Mínimo 5 caracteres')
})

export const create_staff_default_values = {
    full_name: '',
    username: '',
    password: ''
}