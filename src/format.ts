import type { FormatCurrencyOptions, RoundingMode } from './types'
import { roundNumber } from './utils/round'

export function formatCurrency(value: number, options: FormatCurrencyOptions): string {
  const {
    currency,
    locale = 'en-US',
    minimumFractionDigits,
    maximumFractionDigits,
    style = 'currency',
    roundingMode = 'half-up',
  } = options

  // Determine default fraction digits from Intl for the currency
  const defaultFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency })
  const resolved = defaultFormatter.resolvedOptions()
  const min = minimumFractionDigits ?? resolved.minimumFractionDigits
  const max = maximumFractionDigits ?? resolved.maximumFractionDigits

  let rounded = value
  if (typeof max === 'number') {
    rounded = roundNumber(value, max, roundingMode as RoundingMode)
  }

  const currencyDisplay = style === 'code' ? 'code' : style === 'symbol' ? 'symbol' : 'symbol'
  const nf = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  })
  return nf.format(rounded)
}


