export const FINTECH_METRICS = [
  { label: 'Churn Rate', before: '12%', after: '7.2%', delta: '-40%', unlockedBy: 'anxiety' },
  { label: 'Loan Conversion', before: '3.1%', after: '7.1%', delta: '+2.3x', unlockedBy: 'hesitancy' },
  { label: 'Session Time', before: '2.4m', after: '4.1m', delta: '+71%', unlockedBy: 'struggle' },
  { label: 'NPS Score', before: '34', after: '61', delta: '+79%', unlockedBy: 'cautious' },
]

export const FINTECH_PATTERNS = {
  anxiety: { icon: '😰', name: 'Financial Anxiety', description: 'Frequent balance checks, avoids loss screens' },
  hesitancy: { icon: '🤔', name: 'Decision Hesitancy', description: 'Started loan app, abandoned at terms page' },
  struggle: { icon: '😓', name: 'Product Confusion', description: 'Multiple help accesses on loan screens' },
  cautious: { icon: '🛡️', name: 'Risk-Averse Profile', description: 'Prefers detailed info before acting' },
}

// Dynamic confidence: maxPoints determines how fast confidence ramps up
// At threshold (3 points) = 30-38% confidence. At maxPoints = 99%.
export const FINTECH_TRAITS = {
  anxiety: { label: 'Financial Anxiety', maxPoints: 10 },
  decision_speed: { label: 'Decision Speed: Deliberate', maxPoints: 8 },
  risk: { label: 'Risk Aversion: High', labelNegative: 'Risk Appetite: Aggressive', maxPoints: 10 },
  help_seeking: { label: 'Help-Seeking Behavior', maxPoints: 8 },
  price_sensitive: { label: 'Rate Sensitivity', maxPoints: 8 },
}

// Signal rules: map event types to trait/pattern point accumulation
// Only intentional behavioral signals contribute — routine navigation/clicks are ignored
export const FINTECH_SIGNALS = [
  // Balance checking → anxiety
  { match: { type: 'balance_check' }, traits: { anxiety: 2 }, patterns: { anxiety: 2 } },

  // Help access → help-seeking, struggle
  { match: { type: 'help_accessed' }, traits: { help_seeking: 2 }, patterns: { struggle: 2 } },

  // Form interactions → deliberate decision making
  { match: { type: 'form_interaction' }, traits: { decision_speed: 1 }, patterns: {} },

  // Abandonment → strong hesitancy/risk signals
  { match: { type: 'abandonment' }, traits: { decision_speed: 3 }, patterns: { hesitancy: 3, cautious: 2 } },

  // Screen views with context
  { match: { type: 'screen_view', detailIncludes: 'invest' }, traits: {}, patterns: { cautious: 1 } },
  { match: { type: 'screen_view', detailIncludes: 'loan' }, traits: { price_sensitive: 1.5 }, patterns: { hesitancy: 1 } },
  { match: { type: 'screen_view', detailIncludes: 'help' }, traits: { help_seeking: 1 }, patterns: { struggle: 1 } },

  // Investment clicks → risk profile (positive = averse, negative = appetite)
  { match: { type: 'investment_click', detailIncludes: 'low' }, traits: { risk: 2.5 }, patterns: { cautious: 2 } },
  { match: { type: 'investment_click', detailIncludes: 'medium' }, traits: { risk: 0.5 }, patterns: {} },
  { match: { type: 'investment_click', detailIncludes: 'very high' }, traits: { risk: -1.5 }, patterns: {} },
  { match: { type: 'investment_click', detailIncludes: 'high' }, traits: { risk: -2 }, patterns: {} },
  { match: { type: 'investment_click' }, traits: { price_sensitive: 1 }, patterns: {} },

  // Transaction clicks → mild anxiety signal (repeated checking)
  { match: { type: 'transaction_click' }, traits: { anxiety: 0.5 }, patterns: {} },

  // Screen time on specific screens
  { match: { type: 'screen_time', detailIncludes: 'loan' }, traits: { decision_speed: 1, price_sensitive: 1 }, patterns: { hesitancy: 1 } },
  { match: { type: 'screen_time', detailIncludes: 'help' }, traits: { help_seeking: 1 }, patterns: { struggle: 0.5 } },
  { match: { type: 'screen_time', detailIncludes: 'invest' }, traits: { decision_speed: 0.5 }, patterns: { cautious: 0.5 } },

  // Scroll depth → research behavior (mild)
  { match: { type: 'scroll_depth' }, traits: {}, patterns: { cautious: 0.5 } },

  // Notifications → mild anxiety signal
  { match: { type: 'notification_click' }, traits: { anxiety: 0.5 }, patterns: {} },
]

// Simulated persistent memory — what Fluence already knows from past sessions
export const FINTECH_MEMORY = {
  userId: 'maria_silva',
  totalSessions: 15,
  firstSeen: 'Dec 3, 2024',
  lastSeen: '2 days ago',
  sessionHistory: [
    { date: '2 days ago', summary: 'Checked balance 4x, viewed loan page, abandoned at terms', duration: '4m 12s' },
    { date: '5 days ago', summary: 'Checked balance 2x, browsed investment funds, exited', duration: '2m 45s' },
    { date: '1 week ago', summary: 'Checked balance 3x, accessed help on loan interest rates', duration: '3m 30s' },
  ],
  persistentTraits: [
    { label: 'Balance checking', detail: '12 of 15 sessions', trend: 'stable', icon: '🔁' },
    { label: 'Loan interest', detail: 'Viewed 3 times, never applied', trend: 'recurring', icon: '🔄' },
    { label: 'Terms page exit', detail: 'Left at terms in all 3 loan visits', trend: 'blocker', icon: '🚫' },
  ],
}

// What Fluence sends back to the company via API
// predictions use getValue(points) and getCurrentSignal(events) for dynamic output
export const FINTECH_API_OUTPUT = {
  userId: 'maria_silva',
  segment: { name: 'Cautious Borrower', id: 'cautious-first-time-borrower' },
  predictions: [
    {
      pattern: 'anxiety',
      icon: '⚠️',
      label: 'Churn Risk',
      getValue: (points) => {
        const pct = Math.min(Math.round((points / 10) * 100), 95)
        return pct >= 60 ? `High (${pct}%)` : pct >= 35 ? `Medium (${pct}%)` : `Low (${pct}%)`
      },
      getCurrentSignal: (events) => {
        const balanceChecks = events.filter(e => e.type === 'balance_check').length
        const notifClicks = events.filter(e => e.type === 'notification_click').length
        const txClicks = events.filter(e => e.type === 'transaction_click').length
        const parts = []
        if (balanceChecks > 0) parts.push(`checked balance ${balanceChecks}x`)
        if (notifClicks > 0) parts.push(`clicked ${notifClicks} notification${notifClicks > 1 ? 's' : ''}`)
        if (txClicks > 0) parts.push(`reviewed ${txClicks} transaction${txClicks > 1 ? 's' : ''}`)
        if (parts.length > 0) return parts.join(', ') + ' this session'
        return 'Showing anxiety-related browsing patterns'
      },
      historicalContext: 'Has checked balance in 12 of 15 sessions — persistent anxiety pattern',
    },
    {
      pattern: 'hesitancy',
      icon: '📉',
      label: 'Conversion Probability',
      getValue: (points) => {
        const pct = Math.max(100 - Math.min(Math.round((points / 10) * 100), 95), 5)
        return pct <= 30 ? `Low (${pct}%)` : pct <= 60 ? `Medium (${pct}%)` : `Likely (${pct}%)`
      },
      getCurrentSignal: (events) => {
        const formEvents = events.filter(e => e.type === 'form_interaction').length
        const abandonments = events.filter(e => e.type === 'abandonment').length
        if (abandonments > 0 && formEvents > 0) return `Started loan form, interacted ${formEvents}x, then abandoned ${abandonments}x`
        if (abandonments > 0) return `Abandoned loan application ${abandonments}x this session`
        if (formEvents > 0) return `Interacted with loan form ${formEvents}x but hesitating`
        return 'Viewed loan information without starting application'
      },
      historicalContext: 'Viewed loan page 3 times across sessions, never completed application',
    },
    {
      pattern: 'struggle',
      icon: '🎫',
      label: 'Support Ticket Risk',
      getValue: (points) => {
        return points >= 6 ? 'High' : points >= 3 ? 'Medium' : 'Low'
      },
      getCurrentSignal: (events) => {
        const helpEvents = events.filter(e => e.type === 'help_accessed')
        if (helpEvents.length > 0) {
          const topics = helpEvents.map(e => e.detail).filter(Boolean).slice(0, 2).join(', ')
          return `Accessed help ${helpEvents.length}x${topics ? ` (${topics})` : ''}`
        }
        return 'Showing signs of product confusion'
      },
      historicalContext: 'Previously accessed help on loan rates — still confused about terms',
    },
    {
      pattern: 'cautious',
      icon: '🔍',
      label: 'Decision Style',
      getValue: () => 'Information-first',
      getCurrentSignal: (events) => {
        const screenViews = events.filter(e => e.type === 'screen_view').length
        const investClicks = events.filter(e => e.type === 'investment_click').length
        const scrollDepth = events.filter(e => e.type === 'scroll_depth').length
        const parts = []
        if (investClicks > 0) parts.push(`browsed ${investClicks} investment option${investClicks > 1 ? 's' : ''}`)
        if (scrollDepth > 0) parts.push(`scrolled through content`)
        if (screenViews > 2) parts.push(`visited ${screenViews} screens`)
        if (parts.length > 0) return parts.join(', ') + ' — researching before acting'
        return 'Browsing detailed info before acting'
      },
      historicalContext: 'Always exits at terms page — needs full transparency before committing',
    },
  ],
  recommendations: [
    { pattern: 'anxiety', do: 'Use reassuring, educational messaging', avoid: 'Urgency language, countdown timers' },
    { pattern: 'hesitancy', do: 'Show calculator before commitment, simplify to 2 steps max', avoid: 'Dense legal text, multi-step application flows' },
    { pattern: 'struggle', do: 'Proactive FAQ, contextual help tooltips on forms', avoid: 'Assuming product knowledge, hiding support' },
    { pattern: 'cautious', do: 'Transparent rates, side-by-side product comparisons', avoid: 'Aggressive upsells, hidden fees, bait-and-switch' },
  ],
  // Per-pattern communication fragments — composed dynamically based on detected patterns
  communicationStyles: {
    anxiety: {
      tone: 'Reassuring & calming',
      contentPriority: ['Savings goal tracker', 'Balance alerts', 'Spending insights'],
      avoid: ['Urgency language', 'Countdown timers', 'Loss framing'],
    },
    hesitancy: {
      tone: 'Patient & educational',
      contentPriority: ['Loan calculator', 'Step-by-step guides', 'No-commitment previews'],
      avoid: ['Dense legal text', 'Multi-step forms', 'Pressure tactics'],
    },
    struggle: {
      tone: 'Supportive & clear',
      contentPriority: ['Contextual FAQ', 'Help tooltips', 'Plain-language terms'],
      avoid: ['Financial jargon', 'Assuming product knowledge', 'Hiding support'],
    },
    cautious: {
      tone: 'Transparent & informative',
      contentPriority: ['Side-by-side comparisons', 'Detailed rate breakdowns', 'Risk explanations'],
      avoid: ['Aggressive upsells', 'Hidden fees', 'Bait-and-switch offers'],
    },
  },
}
