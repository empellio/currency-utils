import type { ConvertCurrencyOptions, CurrencyCode, RateCache, RateProviderFn } from './types'
import { roundNumber } from './utils/round'

let currentProvider: RateProviderFn | null = null
let currentCache: RateCache | null = null
let defaultPrecision = 2

export function injectProvider(provider: RateProviderFn) {
  currentProvider = provider
}

export function injectCache(cache: RateCache) {
  currentCache = cache
}

export function setDefaultPrecision(precision: number) {
  defaultPrecision = precision
}

export async function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  options: ConvertCurrencyOptions = {},
): Promise<number> {
  if (from === to) return roundNumber(amount, options.precision ?? defaultPrecision)
  if (!currentProvider) throw new Error('Rate provider not configured')
  const dateKey = options.date ? (typeof options.date === 'string' ? options.date : options.date.toISOString().slice(0, 10)) : 'latest'
  const cacheKey = `${from}:${to}:${dateKey}`
  const precision = options.precision ?? defaultPrecision

  const cached = await (currentCache?.getRate(cacheKey) as number | undefined)
  if (typeof cached === 'number') {
    return roundNumber(amount * cached, precision, options.roundingMode)
  }

  const rate = await currentProvider(from, to, { date: options.date })
  currentCache?.setRate(cacheKey, rate)
  return roundNumber(amount * rate, precision, options.roundingMode)
}


