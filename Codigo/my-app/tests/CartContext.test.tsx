import React from 'react'
import { render, act } from '@testing-library/react'
import { CartProvider, useCart } from '../contexts/CartContext'

const TestComponent = () => {
    const { items, eventId, addItem, removeItem, updateQuantity, clearCart } = useCart()
    return (
        <div>
            <span data-testid="items">{JSON.stringify(items)}</span>
            <span data-testid="eventId">{eventId}</span>
            <button onClick={() => addItem({ id: '1', name: 'Item 1', price: 10, quantity: 1, event_product_id: 1 }, 100)}>add</button>
            <button onClick={() => removeItem('1')}>remove</button>
            <button onClick={() => updateQuantity('1', 3)}>update</button>
            <button onClick={clearCart}>clear</button>
            <button onClick={() => updateQuantity('1', 0)}>set zero</button>
        </div>
    )
}

const setup = () => {
    return render(
        <CartProvider>
            <TestComponent />

        </CartProvider>
    )
}

describe('CartContext', () => {
    it('adicionar item ao carrinho e setar eventId', () => {
        const { getByText, getByTestId } = setup()
        act(() => {
            getByText('add').click()
        })
        expect(getByTestId('items').textContent).toContain('Item 1')
        expect(getByTestId('eventId').textContent).toBe('100')
    })

    it('incrementar quantidade de item', () => {
        const { getByText, getByTestId } = setup()
        act(() => {
            getByText('add').click()
            getByText('add').click()
        })
        const items = JSON.parse(getByTestId('items').textContent || '[]')
        expect(items[0].quantity).toBe(2)
    })

    it('remover item', () => {
        const { getByText, getByTestId } = setup()
        act(() => {
            getByText('add').click()
            getByText('remove').click()
        })
        expect(getByTestId('items').textContent).toBe('[]')
    })

    it('atualizar quantidade de itens', () => {
        const { getByText, getByTestId } = setup()
        act(() => {
            getByText('add').click()
            getByText('update').click()
        })
        const items = JSON.parse(getByTestId('items').textContent || '[]')
        expect(items[0].quantity).toBe(3)
    })

    it('remover item que quantidade é 0', () => {
        const { getByText, getByTestId } = setup()
        act(() => {
            getByText('add').click()
            getByText('set zero').click()
        })
        expect(getByTestId('items').textContent).toBe('[]')
    })
    it('limpar o carrinho e resetar eventId', () => {
        const { getByText, getByTestId } = setup()
        act(() => {
            getByText('add').click()
            getByText('clear').click()
        })
        expect(getByTestId('items').textContent).toBe('[]')
        expect(getByTestId('eventId').textContent).toBe('')
    })

    it('erro se o carrinho for usado fora do provider', () => {
        // suprimir erro 
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { })
        const Broken = () => {
            useCart()
            return null
        }
        expect(() => render(<Broken />)).toThrow('useCart must be used within CartProvider')
        spy.mockRestore()
    })
})