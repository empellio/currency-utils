import type {
  CurrencyCode,
  FormatCurrencyOptions,
  ConvertCurrencyOptions,
  RateProviderName,
  RateProviderFn,
  RateCache,
} from './types'
import { formatCurrency } from './format'
import { convertCurrency, injectCache, injectProvider, setDefaultPrecision } from './convert'
import * as ecb from './providers/ecb'
import * as cnb from './providers/cnb'
import * as erh from './providers/exchangeratehost'
import { InMemoryRateCache, persistCache, restoreCache } from './cache'

let provider: RateProviderFn = ecb.getRate
let cache: RateCache = new InMemoryRateCache()

// Load persisted cache best-effort
if (cache instanceof InMemoryRateCache) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  restoreCache(cache as InMemoryRateCache)
}

injectProvider(provider)
injectCache(cache)

export { formatCurrency, convertCurrency }
export type {
  CurrencyCode,
  FormatCurrencyOptions,
  ConvertCurrencyOptions,
  RateProviderFn,
  RateCache,
}

export function setRateProvider(nameOrFn: RateProviderName | RateProviderFn) {
  if (typeof nameOrFn === 'function') {
    provider = nameOrFn
  } else {
    switch (nameOrFn) {
      case 'ecb':
        provider = ecb.getRate
        break
      case 'cnb':
        provider = cnb.getRate
        break
      case 'exchangeratehost':
        provider = erh.getRate
        break
      default:
        provider = ecb.getRate
    }
  }
  injectProvider(provider)
}

export function setCache(customCache: RateCache) {
  cache = customCache
  injectCache(cache)
}

export function getCache(): RateCache {
  return cache
}

export function setDefaultConvertPrecision(precision: number) {
  setDefaultPrecision(precision)
}

// Optional: persist cache on process exit for offline fallback
if (cache instanceof InMemoryRateCache) {
  const c = cache as InMemoryRateCache
  const persist = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    persistCache(c)
  }
  process.on('beforeExit', persist)
  process.on('exit', persist)
}


