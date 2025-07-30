// Libs
import z from 'zod'

export const update_produto_validation = z.object({
    name: z.string().min(1, 'Campo obrigatório'),
    description: z.string().min(1, 'Campo obrigatório'),
    price: z.string().min(1, 'Campo obrigatório'),
    category: z.enum(['comida', 'bebida'], {message: 'Campo obrigatório'}),
    
})