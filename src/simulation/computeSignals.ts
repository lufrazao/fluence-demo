import type { AppEvent, SignalRule } from '../types/simulation';

/**
 * Minimum absolute points before a trait or pattern becomes visible.
 * Lowered to 1.5 to work with exponential decay (where effective values are smaller).
 */
export const SIGNAL_THRESHOLD = 1.5;

/**
 * Decay factor per event. Each older event's contribution is multiplied
 * by DECAY relative to the next newer one:
 *   weight(event_i) = DECAY^(total_events - 1 - i)
 *
 * With 0.95: the 10th-most-recent event keeps ~60% weight, the 20th ~36%,
 * the 40th ~13%. Recent behavior dominates, but earlier signals still matter.
 *
 * This gives:
 *  - Reactivity: switching from low-risk to high-risk funds flips the trait
 *  - Stabilization: sustained consistent behavior converges to a steady state
 */
const DECAY = 0.95;

export function computeSignals(
  events: AppEvent[],
  signalRules: SignalRule[]
): { traitPoints: Record<string, number>; patternPoints: Record<string, number> } {
  const traitPoints: Record<string, number> = {};
  const patternPoints: Record<string, number> = {};
  const n = events.length;

  for (let i = 0; i < n; i++) {
    const weight = Math.pow(DECAY, n - 1 - i);
    const event = events[i];

    for (const rule of signalRules) {
      if (event.type !== rule.match.type) continue;
      if (
        rule.match.labelIncludes &&
        !event.label?.toLowerCase().includes(rule.match.labelIncludes.toLowerCase())
      )
        continue;
      if (
        rule.match.detailIncludes &&
        !event.detail?.toLowerCase().includes(rule.match.detailIncludes.toLowerCase())
      )
        continue;

      for (const [key, val] of Object.entries(rule.traits || {})) {
        traitPoints[key] = (traitPoints[key] || 0) + val * weight;
      }
      for (const [key, val] of Object.entries(rule.patterns || {})) {
        patternPoints[key] = (patternPoints[key] || 0) + val * weight;
      }
    }
  }

  return { traitPoints, patternPoints };
}
