function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

const HOTELS_DEFAULT = [
  {
    id: 1,
    name: 'The Imperial Tokyo',
    type: 'Luxury',
    stars: 5,
    price: 450,
    rating: 4.9,
    reviews: 2841,
    image: '🏯',
    perks: ['Spa', 'Pool', 'Fine Dining'],
  },
  {
    id: 2,
    name: 'Sakura Garden Hotel',
    type: 'Mid-Range',
    stars: 4,
    price: 180,
    rating: 4.5,
    reviews: 1203,
    image: '🌸',
    perks: ['Free WiFi', 'Breakfast', 'Central'],
  },
  {
    id: 3,
    name: 'Tokyo Nest Hostel',
    type: 'Budget',
    stars: 3,
    price: 89,
    rating: 4.2,
    reviews: 876,
    image: '🏠',
    perks: ['Free WiFi', 'Lounge', 'Kitchen'],
  },
]

const HOTELS_FLUENCE = [
  {
    id: 2,
    name: 'Sakura Garden Hotel',
    type: 'Mid-Range',
    stars: 4,
    price: 180,
    rating: 4.5,
    reviews: 1203,
    image: '🌸',
    perks: ['Free WiFi', 'Breakfast', 'Central'],
    badge: 'Smart Pick for You',
    highlight: true,
    socialProof: '15 people booked today',
  },
  {
    id: 1,
    name: 'The Imperial Tokyo',
    type: 'Luxury',
    stars: 5,
    price: 450,
    rating: 4.9,
    reviews: 2841,
    image: '🏯',
    perks: ['Spa', 'Pool', 'Fine Dining'],
  },
  {
    id: 3,
    name: 'Tokyo Nest Hostel',
    type: 'Budget',
    stars: 3,
    price: 89,
    rating: 4.2,
    reviews: 876,
    image: '🏠',
    perks: ['Free WiFi', 'Lounge', 'Kitchen'],
  },
]

export default function HotelScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const hotels = fluenceEnabled ? HOTELS_FLUENCE : HOTELS_DEFAULT

  const handleHotelClick = (hotel) => {
    onEvent({ type: 'click', label: 'Selected hotel', detail: `${hotel.name} $${hotel.price}/n`, time: now() })
    onNavigate('booking')
  }

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-2 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => {
              onEvent({ type: 'click', label: 'Back to results', detail: 'hotel→results', time: now() })
              onNavigate('results')
            }}
            className="text-white/80 text-sm hover:text-white transition-colors"
          >
            ← Back
          </button>
          <div className="flex-1" />
          <span className="text-white/60 text-xs">3 hotels</span>
        </div>
        <h2 className="text-white text-lg font-bold">Hotels in Tokyo</h2>
        <p className="text-blue-100 text-xs">Mar 15 - Mar 22 &middot; 7 nights</p>
      </div>

      <div className="px-4 -mt-3 flex-1 overflow-y-auto space-y-3">
        {/* Fluence: insight banner */}
        {fluenceEnabled && (
          <div className="bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-200 rounded-xl px-4 py-2.5 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-sm">💡</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">Matched to your style</p>
                <p className="text-[10px] text-gray-500">Great amenities within your typical budget range</p>
              </div>
            </div>
          </div>
        )}

        {/* Hotel cards */}
        {hotels.map((hotel, index) => (
          <button
            key={hotel.id}
            onClick={() => handleHotelClick(hotel)}
            className={`w-full text-left bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98] transition-all ${
              hotel.highlight ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Badge bar */}
            {hotel.badge && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-1.5 flex items-center justify-between">
                <span className="text-[10px] text-white font-semibold flex items-center gap-1">
                  ✨ {hotel.badge}
                </span>
                {hotel.socialProof && (
                  <span className="text-[10px] text-blue-100 flex items-center gap-1">
                    🔥 {hotel.socialProof}
                  </span>
                )}
              </div>
            )}

            <div className="p-4">
              <div className="flex gap-3">
                {/* Image placeholder */}
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {hotel.image}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 leading-tight">{hotel.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-gray-400">{hotel.type}</span>
                        <span className="text-gray-300">&middot;</span>
                        <span className="text-yellow-400 text-[10px]">
                          {'★'.repeat(hotel.stars)}{'☆'.repeat(5 - hotel.stars)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-bold ${hotel.highlight ? 'text-blue-600' : 'text-gray-800'}`}>
                        ${hotel.price}
                      </p>
                      <p className="text-[10px] text-gray-400">/night</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">
                      {hotel.rating}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {hotel.rating >= 4.7 ? 'Exceptional' : hotel.rating >= 4.3 ? 'Excellent' : 'Very Good'} &middot; {hotel.reviews.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* Perks */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hotel.perks.map(perk => (
                      <span key={perk} className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social proof for non-badge highlighted items */}
              {hotel.socialProof && !hotel.badge && (
                <p className="text-[10px] text-pink-500 mt-2 ml-[76px] font-medium">
                  🔥 {hotel.socialProof}
                </p>
              )}
            </div>
          </button>
        ))}

        {/* Total estimate */}
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Estimated Trip Total</p>
          <p className="text-lg font-bold text-gray-800 mt-0.5">
            {fluenceEnabled ? '$1,940' : '$2,480'}
          </p>
          <p className="text-[10px] text-gray-400">Flight + 7 nights</p>
          {fluenceEnabled && (
            <p className="text-[10px] text-green-500 font-semibold mt-1">Saving $540 vs. your first search</p>
          )}
        </div>
      </div>
    </div>
  )
}
