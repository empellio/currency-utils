export async function getFetch(): Promise<typeof fetch> {
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis) as typeof fetch
  }
  try {
    const mod = await import('node-fetch')
    // @ts-expect-error node-fetch CJS default
    const f = (mod.default || mod) as typeof fetch
    return f as typeof fetch
  } catch (err) {
    throw new Error(
      'Fetch API is not available. Use Node 18+ or install optional dependency "node-fetch".',
    )
  }
}


