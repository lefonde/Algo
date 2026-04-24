import type { SourceKind } from '@repo/content'

export const SOURCE_WEIGHTS: Record<SourceKind, number> = {
  lecture: 3.0,
  maman: 2.5,
  'past-exam': 2.0,
  'recent-exam': 3.0,
  'whatsapp-hint': 1.5,
  'sample-exam': 2.0,
  textbook: 0.5,
}

export type ScoreBand = 'critical' | 'high' | 'medium' | 'low'

export function computeScore(sourceKinds: SourceKind[]): number {
  const total = sourceKinds.reduce((sum, kind) => sum + SOURCE_WEIGHTS[kind], 0)
  return Math.min(10, total)
}

export function scoreBand(score: number): ScoreBand {
  if (score >= 8) return 'critical'
  if (score >= 7) return 'high'
  if (score >= 5) return 'medium'
  return 'low'
}

export function scoreBandLabel(score: number): string {
  const labels: Record<ScoreBand, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }
  return labels[scoreBand(score)] ?? 'Unknown'
}

export function computeTrend(
  oldScore: number,
  newScore: number,
  reason: string,
): { direction: 'up' | 'down'; delta: number; reason: string } | undefined {
  if (oldScore === newScore) return undefined
  return {
    direction: newScore > oldScore ? 'up' : 'down',
    delta: Math.abs(newScore - oldScore),
    reason,
  }
}
