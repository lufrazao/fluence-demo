import { useState } from 'react'

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

export default function BookingScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const [step, setStep] = useState(1)
  const [payLater, setPayLater] = useState(fluenceEnabled)

  const totalSteps = fluenceEnabled ? 2 : 3

  const handleFieldFocus = (field) => {
    onEvent({ type: 'form_interaction', label: `Focused ${field}`, detail: `booking step ${step}`, time: now() })
  }

  const handleNextStep = () => {
    if (step < totalSteps) {
      const nextStep = step + 1
      setStep(nextStep)
      onEvent({ type: 'click', label: `Booking step ${nextStep}`, detail: `step ${step}→${nextStep}`, time: now() })
    } else {
      onEvent({ type: 'transaction', label: 'Booking confirmed', detail: payLater ? 'pay-later' : 'full-payment', time: now() })
    }
  }

  const handleAbandon = () => {
    onEvent({ type: 'abandonment', label: 'Booking abandoned', detail: `left at step ${step}/${totalSteps}`, time: now() })
    onNavigate('hotel')
  }

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-2 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => {
              onEvent({ type: 'click', label: 'Back to hotels', detail: 'booking→hotel', time: now() })
              onNavigate('hotel')
            }}
            className="text-white/80 text-sm hover:text-white transition-colors"
          >
            ← Back
          </button>
          <div className="flex-1" />
          <span className="text-white/60 text-xs">Secure booking</span>
          <span className="text-white/60 text-xs">🔒</span>
        </div>
        <h2 className="text-white text-lg font-bold">Complete Booking</h2>
        <p className="text-blue-100 text-xs">AeroConnect + Sakura Garden Hotel</p>
      </div>

      <div className="px-4 -mt-3 flex-1 overflow-y-auto space-y-3">
        {/* Progress indicator */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              Step {step} of {totalSteps}
            </span>
            <span className="text-[10px] text-blue-500 font-semibold">
              {Math.round((step / totalSteps) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i + 1 <= step
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {i + 1 <= step ? '✓' : i + 1}
                </div>
                <span className="text-[9px] text-gray-400">
                  {fluenceEnabled
                    ? ['Details', 'Confirm'][i]
                    : ['Details', 'Payment', 'Confirm'][i]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fluence: free cancellation badge */}
        {fluenceEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2 animate-fade-in">
            <span className="text-sm">🛡️</span>
            <div>
              <p className="text-xs font-semibold text-green-700">Free Cancellation</p>
              <p className="text-[10px] text-green-600">Cancel up to 48h before for a full refund</p>
            </div>
          </div>
        )}

        {/* Trip summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trip Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>✈️</span>
                <span className="text-gray-700">AeroConnect - Direct</span>
              </div>
              <span className="font-semibold text-gray-800">$680</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>🏨</span>
                <span className="text-gray-700">Sakura Garden x7 nights</span>
              </div>
              <span className="font-semibold text-gray-800">$1,260</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">Total</span>
              <span className="text-lg font-bold text-blue-600">$1,940</span>
            </div>
          </div>
        </div>

        {/* Step 1: Traveler details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 animate-fade-in">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Traveler Details</h3>

            <div>
              <label className="text-[10px] text-gray-400 font-medium">Full Name</label>
              <div
                className="border border-gray-200 rounded-xl px-3 py-2.5 mt-1 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleFieldFocus('name')}
              >
                <span className="text-sm text-gray-300">Enter full name</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-medium">Email</label>
              <div
                className="border border-gray-200 rounded-xl px-3 py-2.5 mt-1 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleFieldFocus('email')}
              >
                <span className="text-sm text-gray-300">your@email.com</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-medium">Passport Number</label>
              <div
                className="border border-gray-200 rounded-xl px-3 py-2.5 mt-1 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleFieldFocus('passport')}
              >
                <span className="text-sm text-gray-300">AB1234567</span>
              </div>
            </div>

            {fluenceEnabled && (
              <p className="text-[10px] text-gray-400 italic flex items-center gap-1">
                🔒 Your data is encrypted and never shared with third parties
              </p>
            )}
          </div>
        )}

        {/* Step 2 (non-fluence): Payment */}
        {!fluenceEnabled && step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 animate-fade-in">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Details</h3>

            <div>
              <label className="text-[10px] text-gray-400 font-medium">Card Number</label>
              <div
                className="border border-gray-200 rounded-xl px-3 py-2.5 mt-1 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleFieldFocus('card')}
              >
                <span className="text-sm text-gray-300">1234 5678 9012 3456</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-gray-400 font-medium">Expiry</label>
                <div
                  className="border border-gray-200 rounded-xl px-3 py-2.5 mt-1 cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => handleFieldFocus('expiry')}
                >
                  <span className="text-sm text-gray-300">MM/YY</span>
                </div>
              </div>
              <div className="w-24">
                <label className="text-[10px] text-gray-400 font-medium">CVV</label>
                <div
                  className="border border-gray-200 rounded-xl px-3 py-2.5 mt-1 cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => handleFieldFocus('cvv')}
                >
                  <span className="text-sm text-gray-300">123</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-yellow-700 font-medium">Full payment of $1,940 will be charged now</p>
            </div>
          </div>
        )}

        {/* Step 2 (fluence): Confirm with pay-later option */}
        {fluenceEnabled && step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 animate-fade-in">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Option</h3>

            {/* Pay later option - prominent */}
            <button
              onClick={() => {
                setPayLater(true)
                onEvent({ type: 'click', label: 'Selected pay later', detail: 'book-now-pay-later', time: now() })
              }}
              className={`w-full text-left border-2 rounded-xl p-3 transition-all ${
                payLater ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    payLater ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {payLater && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Book Now, Pay Later</p>
                    <p className="text-[10px] text-gray-500">Reserve with $0 today - pay closer to travel</p>
                  </div>
                </div>
                <span className="text-[10px] bg-pink-400 text-white px-2 py-0.5 rounded-full font-semibold">
                  Popular
                </span>
              </div>
            </button>

            {/* Pay now option */}
            <button
              onClick={() => {
                setPayLater(false)
                onEvent({ type: 'click', label: 'Selected pay now', detail: 'full-payment', time: now() })
              }}
              className={`w-full text-left border-2 rounded-xl p-3 transition-all ${
                !payLater ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  !payLater ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  {!payLater && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pay in Full</p>
                  <p className="text-[10px] text-gray-500">$1,940 charged to your card today</p>
                </div>
              </div>
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <span className="text-xs mt-0.5">💡</span>
              <p className="text-[10px] text-blue-700">
                83% of travelers to Tokyo choose "Book Now, Pay Later" for flexibility
              </p>
            </div>
          </div>
        )}

        {/* Non-fluence step 3: Confirm */}
        {!fluenceEnabled && step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 animate-fade-in">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Review & Confirm</h3>
            <p className="text-xs text-gray-600">Please review your booking details before confirming.</p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs text-gray-600">
              <p>Traveler: (as entered)</p>
              <p>Flight: AeroConnect - Direct to Tokyo</p>
              <p>Hotel: Sakura Garden Hotel - 7 nights</p>
              <p className="font-semibold text-gray-800 pt-1 border-t border-gray-200">Total: $1,940</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleNextStep}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-200"
          >
            {step < totalSteps
              ? 'Continue'
              : fluenceEnabled
                ? (payLater ? 'Reserve Now - Pay Later' : 'Confirm & Pay $1,940')
                : 'Confirm & Pay $1,940'
            }
          </button>

          <button
            onClick={handleAbandon}
            className="w-full text-gray-400 text-xs py-2 hover:text-gray-600 transition-colors"
          >
            Cancel booking
          </button>
        </div>

        {/* Trust signals for fluence */}
        {fluenceEnabled && (
          <div className="flex items-center justify-center gap-4 py-2">
            <span className="text-[9px] text-gray-400 flex items-center gap-1">🔒 SSL Encrypted</span>
            <span className="text-[9px] text-gray-400 flex items-center gap-1">🛡️ Buyer Protection</span>
            <span className="text-[9px] text-gray-400 flex items-center gap-1">⭐ 4.8/5 Trust Score</span>
          </div>
        )}
      </div>
    </div>
  )
}
