import { useState } from 'react'

export default function LoanScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const now = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const [step, setStep] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const startApp = (amount) => {
    setStep(1)
    setSelectedAmount(amount)
    onEvent({ type: 'form_interaction', label: 'Loan application started', detail: `amount:${amount || 'unspecified'}`, time: now() })
  }

  const abandon = () => {
    if (step > 0) {
      onEvent({ type: 'abandonment', label: 'Loan application abandoned', detail: `at step ${step}`, time: now() })
    }
    setStep(0)
    onNavigate('home')
  }

  const saveForLater = () => {
    onEvent({ type: 'abandonment', label: 'Saved loan for later', detail: `at step ${step}`, time: now() })
    setStep(0)
    onNavigate('home')
  }

  const faqs = fluenceEnabled
    ? [
        { q: 'Are the rates fixed?', a: 'Yes — 1.9% per month, fixed for the entire term. Your monthly payment never changes.' },
        { q: 'Can I pay off early?', a: 'Absolutely. No early repayment penalties. You only pay interest up to the date you pay off.' },
        { q: 'What documents do I need?', a: 'Just your CPF and income proof. We pre-fill most information from your account.' },
      ]
    : [
        { q: 'What is the CET?', a: 'The CET (Custo Efetivo Total) is the annual percentage rate: 25.4% p.a. It includes all fees and charges.' },
        { q: 'What are the terms?', a: 'Loan terms range from 6 to 48 months. Amounts from R$1,000 to R$50,000. Subject to credit approval.' },
        { q: 'Late payment fees?', a: 'Late payments incur 2% fine + 1% interest per month on the overdue amount, plus daily pro-rata charges.' },
      ]

  if (step === 0) {
    return (
      <div className="flex flex-col flex-1 pb-4">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => onNavigate('home')} className="text-white/80 text-sm">← Back</button>
            <h1 className="text-white font-bold">Personal Loan</h1>
          </div>
        </div>

        <div className="px-5 mt-4 space-y-4">
          {fluenceEnabled ? (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>🛡️</span>
                  <span className="text-sm font-semibold text-emerald-800">No pressure, no commitment</span>
                </div>
                <p className="text-xs text-emerald-700">Explore your options at your own pace. You can save and come back anytime.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">Simple Loan Calculator</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">How much do you need?</p>
                    <div className="flex gap-2">
                      {['R$1,000', 'R$5,000', 'R$10,000', 'R$20,000'].map(a => (
                        <button
                          key={a}
                          onClick={() => startApp(a)}
                          className="flex-1 text-xs py-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 active:bg-violet-100 transition-colors"
                        >{a}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Estimated monthly for R$5,000:</p>
                    <p className="text-lg font-bold text-violet-700">R$ 468.50/mo <span className="text-xs font-normal text-gray-500">x 12 months</span></p>
                    <p className="text-[10px] text-gray-500 mt-1">Rate: 1.9% p.m. · CET: 25.4% p.a.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <p className="text-sm font-bold text-gray-800 mb-1">Personal Loan</p>
                <p className="text-xs text-gray-500 mb-3">Rates starting at 1.9% p.m.</p>
                <p className="text-xs text-gray-500">Amount: R$1,000 – R$50,000</p>
                <p className="text-xs text-gray-500">Terms: 6 – 48 months</p>
                <p className="text-xs text-gray-500 mb-4">CET: from 25.4% p.a.</p>
                <button onClick={() => startApp(null)} className="w-full bg-violet-600 text-white text-sm font-semibold py-3 rounded-xl active:bg-violet-700 transition-colors">Start Application →</button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">Subject to credit approval. Terms and conditions apply.</p>
            </>
          )}

          {/* FAQ section */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Common Questions</p>
            {faqs.map((faq, i) => {
              const isExpanded = expandedFaq === i
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl shadow-sm border mb-2 cursor-pointer transition-all duration-200 ${isExpanded ? 'border-violet-200 ring-1 ring-violet-100' : 'border-gray-100 active:bg-gray-50'}`}
                  onClick={() => {
                    setExpandedFaq(isExpanded ? null : i)
                    onEvent({ type: 'help_accessed', label: `Loan FAQ: ${faq.q}`, detail: faq.q, time: now() })
                  }}
                >
                  <div className="p-3 flex items-center gap-2">
                    <span className="text-sm">💬</span>
                    <p className="text-xs font-medium text-gray-700 flex-1">{faq.q}</p>
                    <span className={`text-gray-300 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>→</span>
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="border-t border-gray-100 pt-2">
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Application form step
  return (
    <div className="flex flex-col flex-1 pb-4">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={abandon} className="text-white/80 text-sm">← Back</button>
          <h1 className="text-white font-bold">Application</h1>
        </div>
        {fluenceEnabled && (
          <div className="flex gap-1">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full ${step >= s ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
        {selectedAmount && (
          <p className="text-violet-200 text-xs mt-2">Loan amount: {selectedAmount}</p>
        )}
      </div>

      <div className="px-5 mt-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500">Full Name</label>
            <div
              className="mt-1 px-3 py-2 border rounded-lg text-sm text-gray-300 bg-gray-50 cursor-pointer active:border-violet-300 transition-colors"
              onClick={() => onEvent({ type: 'form_interaction', label: 'Name field focused', detail: 'loan_form:name', time: now() })}
            >Maria Silva</div>
          </div>
          <div>
            <label className="text-xs text-gray-500">CPF</label>
            <div
              className="mt-1 px-3 py-2 border rounded-lg text-sm text-gray-300 bg-gray-50 cursor-pointer active:border-violet-300 transition-colors"
              onClick={() => onEvent({ type: 'form_interaction', label: 'CPF field focused', detail: 'loan_form:cpf', time: now() })}
            >•••.•••.•••-••</div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Monthly Income</label>
            <div className="mt-1 px-3 py-2 border rounded-lg text-sm text-gray-800 bg-gray-50 cursor-pointer active:border-violet-300 transition-colors"
              onClick={() => onEvent({ type: 'form_interaction', label: 'Income field focused', detail: 'loan_form:income', time: now() })}
            >R$ 5,400.00</div>
          </div>

          {!fluenceEnabled && (
            <div
              className="text-[8px] text-gray-400 leading-relaxed max-h-16 overflow-y-auto border rounded p-2 cursor-pointer"
              onClick={() => onEvent({ type: 'form_interaction', label: 'Terms text viewed', detail: 'loan_terms_scroll', time: now() })}
            >
              Terms: The annual percentage rate (CET) is calculated pursuant to Resolution No. 3.517/2007 of the Central Bank of Brazil. The borrower agrees to repay the principal amount plus accrued interest...
              <span className="text-gray-500 font-medium"> [12 more paragraphs...]</span>
            </div>
          )}

          <button
            onClick={() => {
              if (step < 2) {
                setStep(2)
                onEvent({ type: 'form_interaction', label: 'Loan form step 2', detail: 'terms review', time: now() })
              } else {
                onEvent({ type: 'transaction', label: 'Loan application submitted', time: now() })
                setStep(0)
                onNavigate('home')
              }
            }}
            className="w-full bg-violet-600 text-white text-sm font-semibold py-3 rounded-xl active:bg-violet-700 transition-colors"
          >
            {step < 2 ? 'Continue' : 'Submit Application'}
          </button>

          <button onClick={saveForLater} className="w-full text-gray-400 text-xs py-2 active:text-gray-600 transition-colors">
            Save for later
          </button>
        </div>
      </div>
    </div>
  )
}
