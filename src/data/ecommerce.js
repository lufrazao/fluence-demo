// E-commerce vertical data — behavioral signals, dynamic API output
// Pattern follows fintech.js: traits with maxPoints, signals with point accumulation,
// API output with getValue() and getCurrentSignal() for dynamic display

export const ECOMMERCE_METRICS = [
  { label: 'Cart Recovery', before: '3%', after: '22%', delta: '+633%', unlockedBy: 'price_anxious' },
  { label: 'Avg Order Value', before: 'R$415', after: 'R$580', delta: '+40%', unlockedBy: 'analytical' },
  { label: 'Return Rate', before: '18%', after: '11%', delta: '-39%', unlockedBy: 'impulse' },
  { label: 'Repeat Purchase', before: '22%', after: '38%', delta: '+73%', unlockedBy: 'indecisive' },
]

export const ECOMMERCE_PATTERNS = {
  analytical: { icon: '🔍', name: 'Analytical Researcher', description: 'Reads reviews, compares specs before deciding' },
  indecisive: { icon: '🔄', name: 'Cart Churner', description: 'Adds and removes items multiple times' },
  price_anxious: { icon: '💸', name: 'Price Anxiety', description: 'Abandons high-value cart at checkout' },
  impulse: { icon: '⚡', name: 'Impulse Buyer', description: 'Fast decisions, skips research, uses Buy Now' },
  product_interest: { icon: '🎯', name: 'Product Interest Profile', description: 'Browsing patterns reveal category and price preferences' },
}

// Dynamic confidence: maxPoints determines how fast confidence ramps up
// At threshold (2 points) = ~17% confidence. At maxPoints = 99%.
export const ECOMMERCE_TRAITS = {
  analytical: { label: 'Decision Style: Researcher', maxPoints: 12 },
  price_sensitive: { label: 'Price Sensitivity', maxPoints: 12 },
  indecisive: { label: 'Purchase Indecision', maxPoints: 8 },
  quality_driven: { label: 'Quality Priority', maxPoints: 10 },
  impulse: { label: 'Impulse Buying', maxPoints: 10 },
}

// Signal rules: map event types to trait/pattern point accumulation
// IMPORTANT: impulse ONLY triggers on buy_now (skip cart) — not on add_to_cart
export const ECOMMERCE_SIGNALS = [
  // Product viewing → analytical (researching) + builds product interest profile
  { match: { type: 'product_click' }, traits: { analytical: 1.5 }, patterns: { analytical: 1, product_interest: 1.5 } },

  // Review reading → strong analytical signal + product interest
  { match: { type: 'review_read' }, traits: { analytical: 2.5, quality_driven: 1.5 }, patterns: { analytical: 2, product_interest: 1 } },

  // Comparison viewing → analytical + price sensitive + product interest
  { match: { type: 'comparison_view' }, traits: { analytical: 3, price_sensitive: 1.5 }, patterns: { analytical: 2.5, product_interest: 1 } },

  // Price alert → strong price sensitivity + product interest
  { match: { type: 'price_alert_set' }, traits: { price_sensitive: 3 }, patterns: { price_anxious: 2, product_interest: 1 } },

  // Search query → mild analytical
  { match: { type: 'search_query' }, traits: { analytical: 1 }, patterns: {} },

  // Category filter → researching/browsing + product interest
  { match: { type: 'category_filter' }, traits: { analytical: 1.5 }, patterns: { analytical: 1, product_interest: 1.5 } },

  // Add to cart → deliberate product selection + product interest
  { match: { type: 'add_to_cart' }, traits: { quality_driven: 1.5 }, patterns: { product_interest: 1.5 } },

  // Remove from cart → strong indecision signal
  { match: { type: 'remove_from_cart' }, traits: { indecisive: 3 }, patterns: { indecisive: 3 } },

  // Buy now (skip cart) → the ONLY impulse trigger
  { match: { type: 'buy_now' }, traits: { impulse: 4 }, patterns: { impulse: 4 } },

  // Cross-sell click → quality exploration
  { match: { type: 'cross_sell_click' }, traits: { quality_driven: 1.5 }, patterns: {} },

  // Begin checkout → price sensitivity awareness
  { match: { type: 'begin_checkout' }, traits: { price_sensitive: 1.5 }, patterns: { price_anxious: 1 } },

  // Installment view → price sensitivity
  { match: { type: 'installment_view' }, traits: { price_sensitive: 2.5 }, patterns: { price_anxious: 2 } },

  // Checkout abandon → strongest price anxiety signal
  { match: { type: 'checkout_abandon' }, traits: { price_sensitive: 3, indecisive: 2 }, patterns: { price_anxious: 4, indecisive: 2 } },

  // Purchase complete → confirms quality preference
  { match: { type: 'purchase_complete' }, traits: { quality_driven: 2 }, patterns: {} },

  // Screen views with context
  { match: { type: 'screen_view', detailIncludes: 'product' }, traits: { analytical: 1 }, patterns: { analytical: 0.5 } },
  { match: { type: 'screen_view', detailIncludes: 'cart' }, traits: { price_sensitive: 0.5 }, patterns: { price_anxious: 0.5 } },
  { match: { type: 'screen_view', detailIncludes: 'checkout' }, traits: { price_sensitive: 1 }, patterns: { price_anxious: 1 } },

  // Screen time signals
  { match: { type: 'screen_time', detailIncludes: 'product' }, traits: { analytical: 1, quality_driven: 0.5 }, patterns: { analytical: 0.5 } },
  { match: { type: 'screen_time', detailIncludes: 'checkout' }, traits: { price_sensitive: 1 }, patterns: { price_anxious: 0.5 } },

  // Scroll depth → research behavior
  { match: { type: 'scroll_depth' }, traits: { analytical: 0.5 }, patterns: { analytical: 0.5 } },
]

export const ECOMMERCE_MEMORY = {
  userId: 'lucas_demo',
  totalSessions: 14,
  firstSeen: 'Jan 10, 2025',
  lastSeen: '3 hours ago',
  sessionHistory: [
    { date: '3 hours ago', summary: 'Compared 3 headphones, read 8 reviews, abandoned R$2,299 cart', duration: '18m 30s' },
    { date: 'Yesterday', summary: 'Searched "bluetooth headphone", viewed Sony WH-1000XM5, set price alert', duration: '12m 15s' },
    { date: '3 days ago', summary: 'Added MacBook Air to cart, removed it, added Kindle, removed it', duration: '8m 45s' },
  ],
  persistentTraits: [
    { label: 'Review reading', detail: 'Reads avg. 6 reviews per product', trend: 'consistent', icon: '🔁' },
    { label: 'Price comparison', detail: '4 comparisons in last 3 sessions', trend: 'increasing', icon: '📈' },
    { label: 'Checkout abandonment', detail: 'Abandoned 3 carts totaling R$4,230', trend: 'blocker', icon: '🚫' },
  ],
}

// Product catalog reference for recommendation engine
const CATALOG_BY_CATEGORY = {
  Audio: [
    { id: 1, name: 'Sony WH-1000XM5', price: 2299 },
    { id: 9, name: 'JBL Flip 6', price: 599 },
  ],
  Electronics: [
    { id: 2, name: 'MacBook Air M3', price: 8999 },
    { id: 5, name: 'Apple Watch SE', price: 2199 },
    { id: 6, name: 'Kindle Paperwhite', price: 549 },
    { id: 12, name: 'iPad Air M2', price: 5999 },
  ],
  Fashion: [
    { id: 3, name: 'Nike Air Max 90', price: 699 },
    { id: 10, name: 'Ray-Ban Aviator', price: 789 },
  ],
  Home: [
    { id: 4, name: 'Nespresso Vertuo', price: 549 },
    { id: 11, name: 'Dyson V12', price: 3499 },
  ],
  Beauty: [{ id: 7, name: 'Good Girl CH', price: 459 }],
  Accessories: [{ id: 8, name: 'Samsonite Guard IT', price: 329 }],
}

const ALL_CATEGORIES = Object.keys(CATALOG_BY_CATEGORY)

// What Fluence sends back via API — dynamic predictions based on accumulated points
export const ECOMMERCE_API_OUTPUT = {
  userId: 'lucas_demo',
  segment: { name: 'Cautious Researcher', id: 'price-sensitive-researcher', confidence: 0.91 },
  predictions: [
    {
      pattern: 'price_anxious',
      icon: '⚠️',
      label: 'Abandonment Risk',
      getValue: (points) => {
        const pct = Math.min(Math.round((points / 10) * 100), 95)
        return pct >= 60 ? `High (${pct}%)` : pct >= 35 ? `Medium (${pct}%)` : `Low (${pct}%)`
      },
      getCurrentSignal: (events) => {
        const abandons = events.filter(e => e.type === 'checkout_abandon').length
        const checkoutViews = events.filter(e => e.type === 'begin_checkout').length
        const installmentViews = events.filter(e => e.type === 'installment_view').length
        const priceAlerts = events.filter(e => e.type === 'price_alert_set').length
        const parts = []
        if (abandons > 0) parts.push(`abandoned checkout ${abandons}x`)
        if (installmentViews > 0) parts.push(`viewed installment options ${installmentViews}x`)
        if (priceAlerts > 0) parts.push(`set ${priceAlerts} price alert(s)`)
        if (checkoutViews > 0 && abandons === 0) parts.push('hesitating at checkout')
        if (parts.length > 0) return parts.join(', ')
        return 'Monitoring price sensitivity signals'
      },
      historicalContext: 'Abandoned 3 carts totaling R$4,230 — price anxiety at the final step',
    },
    {
      pattern: 'analytical',
      icon: '🔍',
      label: 'Decision Style',
      getValue: (points) => {
        if (points >= 8) return 'Highly Analytical'
        if (points >= 4) return 'Researcher'
        return 'Explorer'
      },
      getCurrentSignal: (events) => {
        const reviews = events.filter(e => e.type === 'review_read').length
        const comparisons = events.filter(e => e.type === 'comparison_view').length
        const productViews = events.filter(e => e.type === 'product_click').length
        const searches = events.filter(e => e.type === 'search_query').length
        const parts = []
        if (reviews > 0) parts.push(`read ${reviews} review(s)`)
        if (comparisons > 0) parts.push(`made ${comparisons} comparison(s)`)
        if (productViews > 1) parts.push(`viewed ${productViews} products`)
        if (searches > 0) parts.push(`searched ${searches}x`)
        if (parts.length > 0) return parts.join(', ') + ' — researching before deciding'
        return 'Browsing and exploring catalog'
      },
      historicalContext: 'Reads avg. 6 reviews per product — needs comprehensive info before deciding',
    },
    {
      pattern: 'indecisive',
      icon: '🔄',
      label: 'Cart Stability',
      getValue: (points) => {
        if (points >= 6) return 'Very Unstable'
        if (points >= 3) return 'Unstable'
        return 'Stable'
      },
      getCurrentSignal: (events) => {
        const adds = events.filter(e => e.type === 'add_to_cart').length
        const removes = events.filter(e => e.type === 'remove_from_cart').length
        const abandons = events.filter(e => e.type === 'checkout_abandon').length
        if (removes > 0 && adds > 0) return `${adds} additions, ${removes} removal(s) — indecision cycle`
        if (abandons > 0) return `Abandoned checkout ${abandons}x after adding items`
        if (adds > 0) return `${adds} item(s) added to cart`
        return 'No cart interactions yet'
      },
      historicalContext: '5 add/remove cycles in last 3 sessions — needs confidence boosters',
    },
    {
      pattern: 'impulse',
      icon: '⚡',
      label: 'Impulse Profile',
      getValue: (points) => {
        if (points >= 6) return 'High'
        if (points >= 3) return 'Moderate'
        return 'Low'
      },
      getCurrentSignal: (events) => {
        const buyNows = events.filter(e => e.type === 'buy_now').length
        const purchases = events.filter(e => e.type === 'purchase_complete').length
        const parts = []
        if (buyNows > 0) parts.push(`${buyNows} "Buy Now" instant purchase(s)`)
        if (purchases > 0) parts.push(`${purchases} purchase(s) completed`)
        if (parts.length > 0) return parts.join(', ')
        return 'Evaluating impulse profile'
      },
      historicalContext: 'Uses "Buy Now" to skip cart — fast decisions on visually appealing products',
    },
    {
      pattern: 'product_interest',
      icon: '🎯',
      label: 'Category Affinity',
      getValue: (points) => {
        if (points >= 8) return 'Strong Profile'
        if (points >= 4) return 'Building Profile'
        return 'Early Signal'
      },
      getCurrentSignal: (events) => {
        const categoryCounts = {}
        for (const e of events) {
          if (e.category && ['product_click', 'category_filter', 'add_to_cart', 'review_read', 'comparison_view', 'buy_now', 'price_alert_set'].includes(e.type)) {
            categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1
          }
        }
        const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
        if (sorted.length === 0) return 'Collecting browsing data...'
        const top = sorted.slice(0, 3).map(([cat, count]) => `${cat} (${count})`).join(', ')
        return `Top categories: ${top}`
      },
      historicalContext: 'Electronics and Audio are primary interests — 70% of browsing time in these categories',
    },
    {
      pattern: 'product_interest',
      icon: '💡',
      label: 'Recommended Products',
      getValue: (points) => {
        if (points >= 6) return `${Math.min(Math.floor(points / 2), 6)} products`
        if (points >= 3) return `${Math.floor(points / 2)} products`
        return 'Collecting data'
      },
      getCurrentSignal: (events) => {
        const viewedIds = new Set()
        const categoryCounts = {}
        const viewedCategories = new Set()
        for (const e of events) {
          if (e.productId) viewedIds.add(e.productId)
          if (e.category) {
            viewedCategories.add(e.category)
            categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1
          }
        }
        if (viewedIds.size === 0) return 'Browse products to generate recommendations'

        const parts = []
        // Recommend unseen products from top category
        const topCat = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
        if (topCat && CATALOG_BY_CATEGORY[topCat]) {
          const unseen = CATALOG_BY_CATEGORY[topCat].filter(p => !viewedIds.has(p.id))
          if (unseen.length > 0) {
            parts.push(`In ${topCat}: ${unseen.map(p => p.name).join(', ')}`)
          }
        }
        // Cross-sell from unexplored categories
        const unexplored = ALL_CATEGORIES.filter(c => !viewedCategories.has(c))
        if (unexplored.length > 0) {
          const crossSell = unexplored.slice(0, 2).map(c => {
            const top = CATALOG_BY_CATEGORY[c][0]
            return `${top.name} (${c})`
          })
          parts.push(`Cross-sell: ${crossSell.join(', ')}`)
        }
        return parts.join(' | ') || 'Viewed all products in top category'
      },
      historicalContext: 'Cross-category recommendations increase AOV by 35% for this user segment',
    },
    {
      pattern: 'product_interest',
      icon: '💰',
      label: 'Price Comfort Zone',
      getValue: (points) => {
        if (points >= 6) return 'Calibrated'
        if (points >= 3) return 'Emerging'
        return 'Detecting'
      },
      getCurrentSignal: (events) => {
        const prices = events
          .filter(e => e.price && ['product_click', 'add_to_cart', 'buy_now', 'review_read', 'comparison_view'].includes(e.type))
          .map(e => e.price)
        if (prices.length === 0) return 'Collecting price preference data...'
        const min = Math.min(...prices)
        const max = Math.max(...prices)
        const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)
        const cartPrices = events.filter(e => e.price && e.type === 'add_to_cart').map(e => e.price)
        const cartAvg = cartPrices.length > 0 ? Math.round(cartPrices.reduce((s, p) => s + p, 0) / cartPrices.length) : null
        let result = `Browse: R$${min.toLocaleString()}–R$${max.toLocaleString()} (avg R$${avg.toLocaleString()})`
        if (cartAvg) result += ` | Cart avg: R$${cartAvg.toLocaleString()}`
        return result
      },
      historicalContext: 'Sweet spot is R$500–R$2,500 — avoid pushing products above R$3,000 without installment framing',
    },
  ],
  recommendations: [
    { pattern: 'analytical', do: 'Comparison charts, detailed specs, verified reviews', avoid: 'Vague descriptions, hiding product details' },
    { pattern: 'indecisive', do: '"Save for later" option, gentle cart reminders', avoid: 'Removing items without confirmation, aggressive pressure' },
    { pattern: 'price_anxious', do: 'Price match guarantee, visible installments, free shipping, easy returns', avoid: 'Surprise fees at checkout, no return policy visible' },
    { pattern: 'impulse', do: 'Social proof, trending badges, simplified checkout', avoid: 'Long forms, too many checkout steps' },
    { pattern: 'product_interest', do: 'Personalized recommendations from top categories, price-matched suggestions, cross-category discovery', avoid: 'Generic "you may also like", products outside price comfort zone, irrelevant categories' },
  ],
  communicationStyles: {
    analytical: {
      tone: 'Informative & trustworthy',
      contentPriority: ['Product comparisons', 'Verified reviews', 'Quality certifications'],
      avoid: ['Impulse triggers', 'Countdown timers', 'Low-quality suggestions'],
    },
    indecisive: {
      tone: 'Gentle & encouraging',
      contentPriority: ['Save for later', 'Cart reminders', 'Satisfaction guarantee'],
      avoid: ['Pressure to buy', 'Removing items without warning', 'Scarcity language'],
    },
    price_anxious: {
      tone: 'Transparent & protective',
      contentPriority: ['Lowest price guarantee', 'Installment options', 'Return policy'],
      avoid: ['Hidden fees', 'Checkout without total price', 'Expensive shipping surprise'],
    },
    impulse: {
      tone: 'Energetic & social',
      contentPriority: ['Trending now', 'Last units', 'One-click checkout'],
      avoid: ['Long forms', 'Too many steps', 'Information overload'],
    },
  },
}
