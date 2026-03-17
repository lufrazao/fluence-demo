// Controls the auto-playing simulation: steps through a persona's journey,
// emitting events at scripted intervals.

import { JOURNEYS } from '../data/shopflow/eventSequences'
import { getProduct } from '../data/shopflow/products'

export class ShoppingEngine {
  constructor(personaId, onEvent, onScreenChange, onCartChange) {
    this.personaId = personaId
    this.journey = JOURNEYS[personaId] || []
    this.onEvent = onEvent
    this.onScreenChange = onScreenChange
    this.onCartChange = onCartChange
    this.currentStep = 0
    this.timer = null
    this.running = false
    this.speed = 1 // multiplier
    this.cart = []
    this.events = []
  }

  start(speed = 1) {
    this.speed = speed
    this.running = true
    this.currentStep = 0
    this.cart = []
    this.events = []
    this._scheduleNext()
  }

  pause() {
    this.running = false
    if (this.timer) clearTimeout(this.timer)
  }

  resume() {
    if (this.currentStep < this.journey.length) {
      this.running = true
      this._scheduleNext()
    }
  }

  reset() {
    this.pause()
    this.currentStep = 0
    this.cart = []
    this.events = []
  }

  setSpeed(speed) {
    this.speed = speed
  }

  destroy() {
    this.pause()
    this.timer = null
  }

  _scheduleNext() {
    if (!this.running || this.currentStep >= this.journey.length) return

    const step = this.journey[this.currentStep]
    const delay = step.delay / this.speed

    this.timer = setTimeout(() => {
      this._executeStep(step)
      this.currentStep++

      if (this.currentStep < this.journey.length) {
        this._scheduleNext()
      }
    }, delay)
  }

  _executeStep(step) {
    const event = {
      id: `${this.personaId}-${Date.now()}-${this.currentStep}`,
      type: step.type,
      detail: step.detail,
      product: step.product ? getProduct(step.product) : null,
      productId: step.product,
      traits: step.traits || {},
      cartValue: step.cartValue,
      isClimax: step.isClimax || false,
      timestamp: new Date().toISOString(),
      step: this.currentStep,
      totalSteps: this.journey.length,
    }

    // Update cart state
    if (step.type === 'add_to_cart' && step.product) {
      const product = getProduct(step.product)
      if (product) {
        this.cart = [...this.cart, product]
        this.onCartChange?.(this.cart)
      }
    } else if (step.type === 'remove_from_cart' && step.product) {
      this.cart = this.cart.filter(p => p.id !== step.product)
      this.onCartChange?.(this.cart)
    } else if (step.type === 'purchase_complete' || step.type === 'checkout_abandon') {
      // Cart cleared after purchase or abandon
    }

    // Update screen
    if (step.screen) {
      this.onScreenChange?.(step.screen, step.product)
    }

    // Emit event
    this.events.push(event)
    this.onEvent?.(event)
  }

  get progress() {
    return this.journey.length > 0
      ? this.currentStep / this.journey.length
      : 0
  }

  get isComplete() {
    return this.currentStep >= this.journey.length
  }

  get currentCartValue() {
    return this.cart.reduce((sum, p) => sum + p.price, 0)
  }
}
