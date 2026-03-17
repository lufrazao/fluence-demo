export default function PhoneFrame({ children, gradient = 'from-gray-100 to-gray-200' }) {
  return (
    <div className="phone-frame flex-shrink-0">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className={`w-full h-full bg-gradient-to-b ${gradient} flex flex-col overflow-hidden`}>
          {/* Status bar space */}
          <div className="h-12 flex-shrink-0" />
          <div className="flex-1 min-h-0">
            {children}
          </div>
        </div>
        <div className="phone-home-indicator" />
      </div>
    </div>
  )
}
