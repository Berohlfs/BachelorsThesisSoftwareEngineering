// Libs
import z from 'zod'

export const update_evento_validation = z.object({
    name: z.string().min(1, 'Campo obrigatório'),
    description: z.string().min(1, 'Campo obrigatório'),
    location: z.string().min(1, 'Campo obrigatório'),
    datetime_start: z.date({ required_error: "Selecione uma data de início" }),
    datetime_end: z.date({ required_error: "Selecione uma data de término" }),
    time_start: z.string().min(1, 'Horário obrigatório'),
    time_end: z.string().min(1, 'Horário obrigatório'),
})