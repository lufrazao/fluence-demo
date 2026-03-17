import { useState } from 'react'

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

export default function SearchScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState(fluenceEnabled ? 'Tokyo' : '')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('1')

  const handleSearch = () => {
    onEvent({ type: 'search', label: 'Search submitted', detail: `${from || 'Any'} → ${to || 'Any'}`, time: now() })
    onNavigate('results')
  }

  const handleFieldFocus = (field) => {
    onEvent({ type: 'form_interaction', label: `Focused ${field}`, detail: field, time: now() })
  }

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-2 pb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/70 text-xs font-medium tracking-wide uppercase">WanderGo</span>
          <span className="text-white/60 text-lg">👤</span>
        </div>
        <h1 className="text-white text-xl font-bold">Where to next?</h1>
        <p className="text-blue-100 text-xs mt-0.5">Find flights, hotels & experiences</p>
      </div>

      <div className="px-4 -mt-4 flex-1 overflow-y-auto">
        {/* Fluence: personalized suggestion */}
        {fluenceEnabled && (
          <div
            className="bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-200 rounded-xl px-4 py-3 mb-3 animate-fade-in cursor-pointer"
            onClick={() => {
              setTo('Tokyo')
              onEvent({ type: 'click', label: 'Tapped suggestion', detail: 'Tokyo pre-fill', time: now() })
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🗼</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Tokyo, Japan</p>
                <p className="text-[11px] text-blue-500">Based on your 3 recent searches</p>
              </div>
              <span className="text-[10px] bg-pink-400 text-white px-2 py-0.5 rounded-full font-semibold">
                Price Alert
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 ml-7">Prices dropped 18% this week</p>
          </div>
        )}

        {/* Search form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 space-y-3">
          {/* From */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">From</label>
            <div
              className="flex items-center gap-2 mt-1 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => handleFieldFocus('from')}
            >
              <span className="text-gray-400 text-sm">🛫</span>
              <input
                type="text"
                placeholder="Departure city"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Swap indicator */}
          <div className="flex justify-center -my-1">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-400 text-xs">
              ↕
            </div>
          </div>

          {/* To */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">To</label>
            <div
              className="flex items-center gap-2 mt-1 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => handleFieldFocus('to')}
            >
              <span className="text-gray-400 text-sm">🛬</span>
              <input
                type="text"
                placeholder="Destination city"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={`flex-1 text-sm outline-none bg-transparent placeholder:text-gray-300 ${fluenceEnabled && to === 'Tokyo' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
              />
              {fluenceEnabled && to === 'Tokyo' && (
                <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">Suggested</span>
              )}
            </div>
          </div>

          {/* Date & Passengers row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</label>
              <div
                className="flex items-center gap-2 mt-1 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleFieldFocus('date')}
              >
                <span className="text-gray-400 text-xs">📅</span>
                <input
                  type="text"
                  placeholder="When?"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-300 w-full"
                />
              </div>
            </div>
            <div className="w-24">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Guests</label>
              <div
                className="flex items-center gap-2 mt-1 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleFieldFocus('passengers')}
              >
                <span className="text-gray-400 text-xs">👥</span>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-200"
          >
            Search Flights
          </button>
        </div>

        {/* Quick destinations */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-gray-500 mb-2">
            {fluenceEnabled ? 'Recommended for You' : 'Popular Destinations'}
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(fluenceEnabled
              ? [
                  { city: 'Tokyo', flag: '🇯🇵', price: '$680' },
                  { city: 'Kyoto', flag: '🏯', price: '$710' },
                  { city: 'Seoul', flag: '🇰🇷', price: '$590' },
                  { city: 'Osaka', flag: '🍣', price: '$650' },
                ]
              : [
                  { city: 'Paris', flag: '🇫🇷', price: '$720' },
                  { city: 'Tokyo', flag: '🇯🇵', price: '$800' },
                  { city: 'NYC', flag: '🇺🇸', price: '$350' },
                  { city: 'London', flag: '🇬🇧', price: '$680' },
                ]
            ).map(d => (
              <button
                key={d.city}
                onClick={() => {
                  setTo(d.city)
                  onEvent({ type: 'click', label: 'Tapped destination', detail: d.city, time: now() })
                }}
                className="flex-shrink-0 bg-white rounded-xl border border-gray-100 px-3 py-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-lg">{d.flag}</span>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{d.city}</p>
                <p className="text-[10px] text-blue-500 font-semibold">from {d.price}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
