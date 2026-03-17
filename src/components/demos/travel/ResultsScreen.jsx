function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

const FLIGHTS_DEFAULT = [
  { id: 1, airline: 'SkyWing Air', departure: '08:30', arrival: '15:45', stops: 'Direct', duration: '14h 15m', price: 800, icon: '🔵' },
  { id: 2, airline: 'Pacific Lines', departure: '11:20', arrival: '20:10', stops: '1 stop', duration: '16h 50m', price: 720, icon: '🟢' },
  { id: 3, airline: 'AeroConnect', departure: '23:55', arrival: '06:30+1', stops: 'Direct', duration: '13h 35m', price: 680, icon: '🟠' },
  { id: 4, airline: 'Global Wings', departure: '14:00', arrival: '22:15', stops: '2 stops', duration: '19h 15m', price: 950, icon: '🟣' },
]

const FLIGHTS_FLUENCE = [
  { id: 3, airline: 'AeroConnect', departure: '23:55', arrival: '06:30+1', stops: 'Direct', duration: '13h 35m', price: 680, icon: '🟠', badge: 'Best Value', highlight: true },
  { id: 2, airline: 'Pacific Lines', departure: '11:20', arrival: '20:10', stops: '1 stop', duration: '16h 50m', price: 720, icon: '🟢' },
  { id: 1, airline: 'SkyWing Air', departure: '08:30', arrival: '15:45', stops: 'Direct', duration: '14h 15m', price: 800, icon: '🔵' },
  { id: 4, airline: 'Global Wings', departure: '14:00', arrival: '22:15', stops: '2 stops', duration: '19h 15m', price: 950, icon: '🟣' },
]

export default function ResultsScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const flights = fluenceEnabled ? FLIGHTS_FLUENCE : FLIGHTS_DEFAULT

  const handleFlightClick = (flight) => {
    onEvent({ type: 'click', label: 'Selected flight', detail: `${flight.airline} $${flight.price}`, time: now() })
    onNavigate('hotel')
  }

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-2 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => {
              onEvent({ type: 'click', label: 'Back to search', detail: 'results→search', time: now() })
              onNavigate('search')
            }}
            className="text-white/80 text-sm hover:text-white transition-colors"
          >
            ← Back
          </button>
          <div className="flex-1" />
          <span className="text-white/60 text-xs">4 results</span>
        </div>
        <h2 className="text-white text-lg font-bold">Flights to Tokyo</h2>
        <p className="text-blue-100 text-xs">Round trip &middot; 1 passenger</p>
      </div>

      <div className="px-4 -mt-3 flex-1 overflow-y-auto space-y-2.5">
        {/* Fluence: price drop alert */}
        {fluenceEnabled && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-2.5 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-sm">📉</span>
              <p className="text-xs font-semibold text-green-700">Price dropped 12% since your last search</p>
            </div>
            <p className="text-[10px] text-green-600 mt-0.5 ml-6">Avg. fare is $55 lower than last week</p>
          </div>
        )}

        {/* Sort bar */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Sort:</span>
          <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${fluenceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            {fluenceEnabled ? 'Smart Value' : 'Departure'}
          </span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">Price</span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">Duration</span>
        </div>

        {/* Flight cards */}
        {flights.map((flight, index) => (
          <button
            key={flight.id}
            onClick={() => handleFlightClick(flight)}
            className={`w-full text-left bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all ${
              flight.highlight ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Badge */}
            {flight.badge && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-0.5 rounded-full font-semibold">
                  {flight.badge}
                </span>
                <span className="text-[10px] text-pink-500 font-medium">Recommended</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              {/* Left: airline & times */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs">{flight.icon}</span>
                  <span className="text-xs font-semibold text-gray-800">{flight.airline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">{flight.departure}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-1">
                    <span className="text-[9px] text-gray-400">{flight.duration}</span>
                    <div className="w-full h-px bg-gray-200 my-0.5 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                    </div>
                    <span className="text-[9px] text-gray-400">{flight.stops}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">{flight.arrival}</p>
                  </div>
                </div>
              </div>

              {/* Right: price */}
              <div className="text-right ml-4 flex-shrink-0">
                <p className={`text-lg font-bold ${flight.highlight ? 'text-blue-600' : 'text-gray-800'}`}>
                  ${flight.price}
                </p>
                <p className="text-[10px] text-gray-400">per person</p>
              </div>
            </div>
          </button>
        ))}

        {/* View hotels prompt */}
        <div className="text-center py-3">
          <button
            onClick={() => {
              onEvent({ type: 'click', label: 'Browse hotels CTA', detail: 'results→hotel', time: now() })
              onNavigate('hotel')
            }}
            className="text-xs text-blue-500 font-medium hover:text-blue-600 transition-colors"
          >
            Browse hotels in Tokyo →
          </button>
        </div>
      </div>
    </div>
  )
}
