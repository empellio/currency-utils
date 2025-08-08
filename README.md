## @empellio/currency-utils

Lightweight TypeScript utilities for currency formatting and conversions using live exchange rates from public APIs (ECB, CNB, exchangerate.host), with caching and offline fallback.

- **Formatting** via `Intl.NumberFormat`
- **Conversion** using pluggable rate providers (default: ECB)
- **Provider switching**: `ecb`, `cnb`, `exchangeratehost` or your custom async function
- **Caching**: in-memory TTL cache with a simple interface to plug your own (e.g., Redis)
- **Offline fallback**: best-effort persistence of last known rates to a temp file
- **TypeScript types** for ISO‑4217 currency codes

### Installation

```bash
npm install @empellio/currency-utils
```

Node 18+ is recommended (native Fetch). For older Node versions, install optional `node-fetch`.

### Quick start

```ts
import { formatCurrency } from '@empellio/currency-utils'

console.log(formatCurrency(1234.5, { currency: 'USD', locale: 'en-US' }))
// $1,234.50
```

### Usage

```ts
import {
  formatCurrency,
  convertCurrency,
  setRateProvider,
  setCache,
} from '@empellio/currency-utils'

// Formatting
formatCurrency(1234.56, { currency: 'EUR', locale: 'cs-CZ' }) // "1 234,56 €"

// Convert amount (rate is fetched and cached)
await convertCurrency(100, 'USD', 'CZK') // e.g. 2300.5

// Switch provider (e.g., CNB)
setRateProvider('cnb')

// Custom provider
setRateProvider(async (from, to) => {
  // fetch your API and return numeric rate (1 from = rate to)
  return 1.2345
})
```

### API Reference

#### formatCurrency(value: number, options)

- **currency**: ISO 4217 code (string)
- **locale**: BCP 47 locale (default `en-US`)
- **minimumFractionDigits**, **maximumFractionDigits**: defaults derived from the currency
- **style**: `currency` | `code` | `symbol` (default `currency`)
- **roundingMode**: `half-up` | `half-down` | `floor` | `ceil` (default `half-up`)

#### convertCurrency(amount, from, to, options?)

- **date**: optional date for historical rate (`YYYY-MM-DD` or `Date`) — provider-dependent
- **precision**: number of fraction digits (default `2`)
- Returns the converted amount (number)

#### setRateProvider(nameOrFn)

- Built-ins: `ecb` (default), `cnb`, `exchangeratehost`
- Or pass a custom `async (from, to, { date? }) => number`

#### setCache(customCache)

Provide an object implementing `RateCache` with:
- `getRate(key): number | Promise<number | undefined>`
- `setRate(key, value, ttlMs?): void | Promise<void>`

### Providers

- **ECB (default)**: uses `frankfurter.app` (free, no API key; powered by ECB reference rates). Supports historical dates.
- **CNB**: uses the official JSON API `https://api.cnb.cz/cnbapi/exrates/daily?base=czk[&date=YYYY-MM-DD]`. Conversion is computed via CZK.
- **exchangerate.host**: general fallback; supports historical dates.

### Notes on caching and offline fallback

- Default in-memory cache TTL is 12 hours. You can replace the cache via `setCache`.
- Last known rates are persisted to a temp file on process exit (best effort) and restored on startup.

### Testing

```bash
npm test
```

### Build

```bash
npm run build
```

### License

MIT


