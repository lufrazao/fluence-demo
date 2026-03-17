// Main simulation page: phone mockup + intelligence panel + recovery comparison
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PhoneFrame from '../../components/PhoneFrame'
import ShopMockup from '../../components/shopflow/ShopMockup'
import SimulationControls from '../../components/shopflow/SimulationControls'
import EventStream from '../../components/shopflow/EventStream'
import ProfileBuilder from '../../components/shopflow/ProfileBuilder'
import RecoveryComparison from '../../components/shopflow/RecoveryComparison'
import { ShoppingEngine } from '../../simulation/ShoppingEngine'
import { calculateProfile, getArchetype } from '../../simulation/IntelligenceCalculator'
import { PERSONAS } from '../../data/shopflow/personas'

export default function LiveDemo() {
  const [selectedPersona, setSelectedPersona] = useState('lucas')
  const [events, setEvents] = useState([])
  const [screen, setScreen] = useState('home')
  const [screenProduct, setScreenProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [isClimax, setIsClimax] = useState(false)
  const engineRef = useRef(null)
  const progressTimerRef = useRef(null)

  const persona = PERSONAS[selectedPersona]
  const profile = calculateProfile(events)
  const archetype = getArchetype(profile)

  // Cleanup
  useEffect(() => {
    return () => {
      engineRef.current?.destroy()
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }
  }, [])

  const handleEvent = useCallback((event) => {
    setEvents(prev => [event, ...prev])
    if (event.isClimax) {
      setIsClimax(true)
      setTimeout(() => setIsClimax(false), 2000)
    }
  }, [])

  const handleScreenChange = useCallback((newScreen, productId) => {
    setScreen(newScreen)
    setScreenProduct(productId || null)
  }, [])

  const handleCartChange = useCallback((newCart) => {
    setCart(newCart)
  }, [])

  const startProgressUpdater = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    progressTimerRef.current = setInterval(() => {
      const engine = engineRef.current
      if (!engine) return
      setProgress(engine.progress)
      if (engine.isComplete) {
        setIsRunning(false)
        setIsComplete(true)
        clearInterval(progressTimerRef.current)
      }
    }, 200)
  }

  const handleStart = () => {
    engineRef.current?.destroy()
    const engine = new ShoppingEngine(selectedPersona, handleEvent, handleScreenChange, handleCartChange)
    engineRef.current = engine
    setEvents([])
    setCart([])
    setScreen('home')
    setScreenProduct(null)
    setIsComplete(false)
    setIsClimax(false)
    setProgress(0)
    engine.start(speed)
    setIsRunning(true)
    startProgressUpdater()
  }

  const handlePause = () => {
    engineRef.current?.pause()
    setIsRunning(false)
  }

  const handleResume = () => {
    engineRef.current?.resume()
    setIsRunning(true)
    startProgressUpdater()
  }

  const handleReset = () => {
    engineRef.current?.destroy()
    setEvents([])
    setCart([])
    setScreen('home')
    setScreenProduct(null)
    setIsRunning(false)
    setIsComplete(false)
    setIsClimax(false)
    setProgress(0)
  }

  const handleSpeedChange = (s) => {
    setSpeed(s)
    engineRef.current?.setSpeed(s)
  }

  const handleSelectPersona = (id) => {
    if (isRunning) return
    setSelectedPersona(id)
    handleReset()
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Controls */}
      <div className="px-6 py-4 border-b border-white/10">
        <SimulationControls
          selectedPersona={selectedPersona}
          onSelectPersona={handleSelectPersona}
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          progress={progress}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          isComplete={isComplete}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-6 p-6 overflow-y-auto">
        {/* Phone mockup */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {persona.name} comprando
            </span>
          </div>
          <PhoneFrame gradient="from-gray-50 to-orange-50">
            <ShopMockup
              screen={screen}
              screenProduct={screenProduct}
              cart={cart}
              persona={persona}
              isClimax={isClimax}
            />
          </PhoneFrame>
        </div>

        {/* Intelligence panel */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Event stream */}
            <div className="glass-card p-4">
              <EventStream events={events} />
            </div>

            {/* Right: Profile builder */}
            <div className="glass-card p-4">
              <ProfileBuilder
                profile={profile}
                archetype={archetype}
                persona={persona}
              />
            </div>
          </div>

          {/* Recovery comparison — shows after simulation completes */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-6"
              >
                <RecoveryComparison personaId={selectedPersona} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
