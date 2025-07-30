// Libs
import z from 'zod'

export const create_produto_validation = z.object({
    name: z.string().min(1, 'Campo obrigatório'),
    description: z.string().min(1, 'Campo obrigatório'),
    price: z.string().min(1, 'Campo obrigatório'),
    category: z.enum(['comida', 'bebida'], {message: 'Campo obrigatório'}),
})

export const create_produto_default_values = {
    name: '',
    description: '',
    price: '',
    category: undefined	
}