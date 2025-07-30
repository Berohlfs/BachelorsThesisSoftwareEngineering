// Libs
import z from 'zod'

export const filters_validation = z.object({
    inicio: z.date({message: 'Obrigatório'}).optional().nullable(),
    fim: z.date({message: 'Obrigatório'}).optional().nullable(),
    ocorrencia: z.string(),
    tipo: z.string()
})

export const filters_default_values = {
    ocorrencia: '',
    tipo: ''
}