import { describe, it, expect, vi, beforeEach } from 'vitest'
import { convertCurrency, setRateProvider, setCache } from '../src'
import type { RateCache, RateProviderFn } from '../src/types'

class TestCache implements RateCache {
  map = new Map<string, number>()
  getRate(key: string): number | undefined {
    return this.map.get(key)
  }
  setRate(key: string, value: number): void {
    this.map.set(key, value)
  }
}

describe('convertCurrency', () => {
  beforeEach(() => {
    setCache(new TestCache())
  })

  it('uses custom provider', async () => {
    const provider: RateProviderFn = async (from, to) => {
      if (from === 'USD' && to === 'EUR') return 0.9
      if (from === 'EUR' && to === 'USD') return 1.111111
      return 1
    }
    setRateProvider(provider)
    const eur = await convertCurrency(100, 'USD', 'EUR')
    expect(eur).toBe(90)
    const usd = await convertCurrency(100, 'EUR', 'USD', { precision: 3 })
    expect(usd).toBe(111.111)
  })

  it('caches results', async () => {
    const spy = vi.fn(async () => 2)
    setRateProvider(spy)
    const a = await convertCurrency(10, 'USD', 'CZK')
    const b = await convertCurrency(20, 'USD', 'CZK')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(a).toBe(20)
    expect(b).toBe(40)
  })
})


