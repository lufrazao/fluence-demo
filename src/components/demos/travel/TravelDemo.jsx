import SearchScreen from './SearchScreen'
import ResultsScreen from './ResultsScreen'
import HotelScreen from './HotelScreen'
import BookingScreen from './BookingScreen'

export default function TravelDemo({ fluenceEnabled, onEvent, screen, onScreenChange }) {
  const nav = (target) => {
    onScreenChange(target)
    onEvent({ type: 'screen_view', label: `Viewed ${target}`, detail: target, time: now() })
  }

  const screens = {
    search: <SearchScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    results: <ResultsScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    hotel: <HotelScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    booking: <BookingScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
  }

  return (
    <div className="flex flex-col h-full">
      {screens[screen] || screens.search}

      {/* Bottom nav */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-around items-center px-6 py-3 bg-white/95 backdrop-blur border-t border-gray-100">
        {[
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'results', icon: '✈️', label: 'Flights' },
          { id: 'hotel', icon: '🏨', label: 'Hotels' },
          { id: 'booking', icon: '📋', label: 'Book' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => nav(tab.id)}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${screen === tab.id ? 'text-blue-500' : 'text-gray-400'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}
