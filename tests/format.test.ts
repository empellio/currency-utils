import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../src'

describe('formatCurrency', () => {
  it('formats with default locale and currency', () => {
    const out = formatCurrency(1234.5, { currency: 'USD', locale: 'en-US' })
    expect(out).toBe('$1,234.50')
  })

  it('respects code style', () => {
    const out = formatCurrency(1000, { currency: 'EUR', locale: 'cs-CZ', style: 'code' })
    expect(out.includes('EUR')).toBe(true)
  })
})


