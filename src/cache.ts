import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import type { RateCache } from './types'

interface CacheEntry {
  value: number
  expiresAt: number
}

export class InMemoryRateCache implements RateCache {
  private store = new Map<string, CacheEntry>()

  constructor(private defaultTtlMs: number = 12 * 60 * 60 * 1000) {}

  getRate(key: string): number | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  setRate(key: string, value: number, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs)
    this.store.set(key, { value, expiresAt })
  }

  dumpAll(): Record<string, CacheEntry> {
    return Object.fromEntries(this.store)
  }

  loadAll(data: Record<string, CacheEntry>): void {
    for (const [k, v] of Object.entries(data)) this.store.set(k, v)
  }
}

// Optional file-based offline fallback for last known rates
const fallbackDir = path.join(os.tmpdir(), 'empellio-currency-utils')
const fallbackFile = path.join(fallbackDir, 'latest-rates.json')

export async function persistCache(cache: InMemoryRateCache) {
  try {
    await fs.mkdir(fallbackDir, { recursive: true })
    await fs.writeFile(fallbackFile, JSON.stringify(cache.dumpAll()), 'utf-8')
  } catch {
    // ignore
  }
}

export async function restoreCache(cache: InMemoryRateCache) {
  try {
    const buf = await fs.readFile(fallbackFile, 'utf-8')
    const data = JSON.parse(buf) as Record<string, CacheEntry>
    cache.loadAll(data)
  } catch {
    // ignore
  }
}


