import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

function renderAt(path = '/zaduzenja') {
  window.history.pushState({}, '', path)
  render(<App />)
}

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  } as Response
}

const sampleOrder = {
  id: 1,
  memberId: 1,
  memberName: 'Adnan Kovač',
  status: 'AKTIVNO',
  issuedAt: '2026-05-01T10:00:00Z',
  dueDate: '2026-06-15',
  returnedAt: null,
  itemCount: 5,
}

function mockApi(orders: unknown[] = [], members: unknown[] = [], items: unknown[] = []) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url === '/api/auth/me') return jsonResponse({ username: 'testuser' })
    if (url.startsWith('/api/orders')) return jsonResponse(orders)
    if (url.startsWith('/api/members')) return jsonResponse(members)
    if (url.startsWith('/api/inventory')) return jsonResponse(items)
    throw new Error(`Unexpected fetch call: ${url}`)
  })
}

describe('App', () => {
  it('renders orders returned by the API', async () => {
    mockApi([sampleOrder])

    renderAt()

    expect(await screen.findByText('Adnan Kovač')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Zaduženja opreme' })).toBeInTheDocument()
  })

  it('renders the order list without bullets', async () => {
    mockApi([sampleOrder])

    renderAt()

    await screen.findByText('Adnan Kovač')

    const main = screen.getByRole('main')
    const list = within(main).getByRole('list')

    expect(getComputedStyle(list).listStyleType).toBe('none')
  })

  it('opens the create order modal', async () => {
    mockApi([], [{ id: 1, fullName: 'Test Member', email: '' }], [{ id: 1, name: 'Test Item', categories: [], description: null, location: null, availableQuantity: 5, totalQuantity: 5, images: [] }])

    renderAt()

    const user = userEvent.setup()

    await screen.findByRole('heading', { name: 'Sva zaduženja' })
    await user.click(screen.getByRole('button', { name: '+ Novo zaduženje' }))

    await screen.findByRole('heading', { name: 'Novo zaduženje' })
    expect(screen.getByLabelText('Član (zadužuje)')).toBeInTheDocument()
    expect(screen.getByLabelText(/Rok za povrat/)).toBeInTheDocument()
  })
})
