import { getFetch } from '../utils/fetch'
import type { CurrencyCode, RateProviderOptions } from '../types'

// Frankfurter.app is a free, no-key API powered by ECB reference rates
// Docs: https://www.frankfurter.app/docs
export async function getRate(
  from: CurrencyCode,
  to: CurrencyCode,
  options?: RateProviderOptions,
): Promise<number> {
  const fetch = await getFetch()
  const date = options?.date ? toIsoDate(options.date) : 'latest'
  const baseUrl = 'https://api.frankfurter.app'
  const url = `${baseUrl}/${date}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ECB provider error: ${res.status}`)
  const data = (await res.json()) as any
  const rate = data?.rates?.[to]
  if (typeof rate !== 'number') throw new Error('ECB provider invalid response')
  return rate
}

function toIsoDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date')
  return date.toISOString().slice(0, 10)
}


