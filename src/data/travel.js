export const TRAVEL_METRICS = [
  { label: 'Booking Rate', before: '8%', after: '10.8%', delta: '+35%', unlockedBy: 'decision_anxiety' },
  { label: 'Upsell Accept', before: '5%', after: '6.4%', delta: '+28%', unlockedBy: 'aspirational' },
  { label: 'Search→Book', before: '4.2d', after: '2.1d', delta: '-50%', unlockedBy: 'planner' },
  { label: 'Avg. Revenue', before: '$680', after: '$840', delta: '+24%', unlockedBy: 'price' },
]

export const TRAVEL_PATTERNS = {
  price: { icon: '💰', name: 'Price-Sensitive Explorer', description: 'Searches same route 3x, compares across dates' },
  aspirational: { icon: '✨', name: 'Aspirational Traveler', description: 'Browses luxury but books budget' },
  decision_anxiety: { icon: '😰', name: 'Booking Anxiety', description: 'Abandoned booking flow twice' },
  planner: { icon: '📋', name: 'Methodical Planner', description: 'Researches extensively before committing' },
}

export const TRAVEL_TRAITS = {
  price_sensitive: { label: 'Price Sensitivity', confidence: 0.89 },
  aspirational: { label: 'Aspirational Taste', confidence: 0.74 },
  decision_anxiety: { label: 'Booking Hesitancy', confidence: 0.82 },
  planner: { label: 'Research-Heavy Style', confidence: 0.68 },
  destination_pref: { label: 'Asia Preference', confidence: 0.71 },
}

export const TRAVEL_SIGNALS = [
  { match: { type: 'search' }, traits: { planner: 3 }, patterns: { planner: 3 } },
  { match: { type: 'form_interaction' }, traits: { planner: 2 }, patterns: { planner: 1 } },
  { match: { type: 'click', labelIncludes: 'flight' }, traits: { price_sensitive: 2 }, patterns: { price: 2 } },
  { match: { type: 'click', labelIncludes: 'hotel' }, traits: { aspirational: 2 }, patterns: { aspirational: 2 } },
  { match: { type: 'click', labelIncludes: 'destination' }, traits: { destination_pref: 2, planner: 1 }, patterns: { planner: 1 } },
  { match: { type: 'click', labelIncludes: 'suggestion' }, traits: { destination_pref: 3 }, patterns: {} },
  { match: { type: 'abandonment' }, traits: { decision_anxiety: 3 }, patterns: { decision_anxiety: 3 } },
  { match: { type: 'screen_view', detailIncludes: 'results' }, traits: { price_sensitive: 1 }, patterns: { price: 1 } },
  { match: { type: 'screen_view', detailIncludes: 'hotel' }, traits: { aspirational: 1, destination_pref: 1 }, patterns: { aspirational: 1 } },
  { match: { type: 'screen_view', detailIncludes: 'booking' }, traits: { decision_anxiety: 1 }, patterns: { decision_anxiety: 1 } },
  { match: { type: 'screen_view' }, traits: { planner: 0.5 }, patterns: {} },
  { match: { type: 'click' }, traits: { price_sensitive: 0.5 }, patterns: {} },
]

export const TRAVEL_MEMORY = {
  userId: 'carlos_demo',
  totalSessions: 8,
  firstSeen: 'Jan 15, 2025',
  lastSeen: '1 day ago',
  sessionHistory: [
    { date: '1 day ago', summary: 'Searched GRU→NRT twice, compared dates, left without booking', duration: '6m 20s' },
    { date: '4 days ago', summary: 'Browsed 5 Tokyo hotels, viewed luxury options, saved mid-range', duration: '8m 10s' },
    { date: '1 week ago', summary: 'Searched GRU→NRT, reached payment step, abandoned', duration: '11m 45s' },
  ],
  persistentTraits: [
    { label: 'Tokyo destination', detail: 'Searched 6 times across 4 sessions', trend: 'strong intent', icon: '🎯' },
    { label: 'Price comparison', detail: 'Avg. 3 date comparisons per search', trend: 'consistent', icon: '🔁' },
    { label: 'Booking abandonment', detail: '2 abandonments at payment step', trend: 'blocker', icon: '🚫' },
  ],
}

export const TRAVEL_API_OUTPUT = {
  userId: 'carlos_demo',
  segment: { name: 'Aspirational Budget Traveler', id: 'aspirational-budget', confidence: 0.82 },
  predictions: [
    {
      pattern: 'price', icon: '💰', label: 'Price Sensitivity', value: 'High (89%)',
      currentSignal: 'Comparing flights and prices this session',
      historicalContext: 'Searched same GRU→NRT route 6 times across 4 sessions — waiting for better price',
    },
    {
      pattern: 'aspirational', icon: '✨', label: 'Booking Style', value: 'Aspirational-but-budget',
      currentSignal: 'Browsing hotel options',
      historicalContext: 'Previously viewed luxury hotels but saved mid-range — consistently aspirational',
    },
    {
      pattern: 'decision_anxiety', icon: '⚠️', label: 'Abandonment Risk', value: 'High (68%)',
      currentSignal: 'Hesitating in booking flow',
      historicalContext: 'Abandoned at payment step twice before — needs flexible payment options',
    },
    {
      pattern: 'planner', icon: '📋', label: 'Decision Timeline', value: '3–5 day research cycle',
      currentSignal: 'Researching and comparing options',
      historicalContext: 'Has been researching this trip for 8 days across multiple sessions',
    },
  ],
  recommendations: [
    { pattern: 'price', do: 'Price drop alerts for GRU→NRT, "Best Value" badges', avoid: 'Showing only premium options at the top' },
    { pattern: 'aspirational', do: 'Mid-range with luxury touches, "Smart Pick" labels', avoid: 'Budget-shaming language or luxury-only filtering' },
    { pattern: 'decision_anxiety', do: '"Book Now, Pay Later" option, free cancellation badges', avoid: 'Non-refundable rates, requiring full payment upfront' },
    { pattern: 'planner', do: 'Comparison tools, price history charts, trip summaries', avoid: 'Rushing to checkout, hiding trip details' },
  ],
  communicationStyle: {
    tone: 'Helpful & value-focused',
    contentPriority: ['Price comparisons', 'Flexible booking options', 'Destination guides'],
    avoid: ['Scarcity pressure', 'Hidden fees', 'Auto-upgrades'],
  },
}
