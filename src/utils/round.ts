import type { RoundingMode } from '../types'

export function roundNumber(value: number, precision: number, mode: RoundingMode = 'half-up') {
  const factor = Math.pow(10, precision)
  const scaled = value * factor
  switch (mode) {
    case 'half-up':
      return Math.round(scaled) / factor
    case 'half-down': {
      const sign = Math.sign(scaled)
      const abs = Math.abs(scaled)
      const floored = Math.floor(abs)
      const diff = abs - floored
      if (diff > 0.5) return sign * (floored + 1) / factor
      if (diff < 0.5) return sign * floored / factor
      return sign * floored / factor
    }
    case 'floor':
      return Math.floor(scaled) / factor
    case 'ceil':
      return Math.ceil(scaled) / factor
    default:
      return Math.round(scaled) / factor
  }
}


