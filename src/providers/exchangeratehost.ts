import { getFetch } from '../utils/fetch'
import type { CurrencyCode, RateProviderOptions } from '../types'

export async function getRate(
  from: CurrencyCode,
  to: CurrencyCode,
  options?: RateProviderOptions,
): Promise<number> {
  const fetch = await getFetch()
  const date = options?.date ? toIsoDate(options.date) : 'latest'
  const url = `https://api.exchangerate.host/${date}?base=${encodeURIComponent(
    from,
  )}&symbols=${encodeURIComponent(to)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`exchangerate.host error: ${res.status}`)
  const data = (await res.json()) as any
  const rate = data?.rates?.[to]
  if (typeof rate !== 'number') throw new Error('exchangerate.host invalid response')
  return rate
}

export function toIsoDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date')
  return date.toISOString().slice(0, 10)
}


