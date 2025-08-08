import { getFetch } from '../utils/fetch'
import type { CurrencyCode, RateProviderOptions } from '../types'

// CNB JSON API: https://api.cnb.cz/cnbapi/exrates/daily?base=czk&date=YYYY-MM-DD
// No API key required.
export async function getRate(
  from: CurrencyCode,
  to: CurrencyCode,
  options?: RateProviderOptions,
): Promise<number> {
  if (from === to) return 1
  const fetch = await getFetch()
  const baseUrl = 'https://api.cnb.cz/cnbapi/exrates/daily?base=czk'
  const dateParam = options?.date ? `&date=${toIsoDate(options.date)}` : ''
  const url = `${baseUrl}${dateParam}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CNB provider error: ${res.status}`)
  const data = (await res.json()) as any
  const map = parseCnbJson(data)
  const czkPerUnit: Record<string, number> = {}
  for (const row of map) czkPerUnit[row.code] = row.rate / row.amount
  czkPerUnit['CZK'] = 1

  const rateFromCzk = from === 'CZK' ? 1 : czkPerUnit[from]
  const rateToCzk = to === 'CZK' ? 1 : czkPerUnit[to]
  if (!rateFromCzk || !rateToCzk) throw new Error('CNB provider missing currency')
  return rateFromCzk / rateToCzk
}

function toIsoDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date')
  return date.toISOString().slice(0, 10)
}

function parseCnbJson(data: any): { amount: number; code: CurrencyCode; rate: number }[] {
  const rates = Array.isArray(data?.rates) ? data.rates : []
  return rates
    .map((r: any) => ({ amount: Number(r.amount), code: r.currencyCode as CurrencyCode, rate: Number(r.rate) }))
    .filter((r: any) => Number.isFinite(r.amount) && Number.isFinite(r.rate) && typeof r.code === 'string')
}


