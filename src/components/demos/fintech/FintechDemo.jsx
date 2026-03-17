import { useRef, useEffect } from 'react'
import HomeScreen from './HomeScreen'
import InvestScreen from './InvestScreen'
import LoanScreen from './LoanScreen'
import HelpScreen from './HelpScreen'

export default function FintechDemo({ fluenceEnabled, onEvent, screen, onScreenChange }) {
  const screenEnteredAt = useRef(Date.now())
  const previousScreen = useRef(screen)
  const scrollThresholds = useRef(new Set())

  // Reset scroll thresholds when screen changes + fire screen_time
  useEffect(() => {
    scrollThresholds.current = new Set()
  }, [screen])

  const handleScroll = (e) => {
    const el = e.target
    if (el.scrollHeight <= el.clientHeight) return
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    for (const threshold of [25, 50, 75, 100]) {
      if (pct >= threshold && !scrollThresholds.current.has(threshold)) {
        scrollThresholds.current.add(threshold)
        onEvent({
          type: 'scroll_depth',
          label: `Scrolled ${threshold}% on ${screen}`,
          detail: `${screen} — ${threshold}%`,
          time: now(),
        })
      }
    }
  }

  // Fire screen_time when screen changes
  useEffect(() => {
    if (previousScreen.current !== screen) {
      const duration = Date.now() - screenEnteredAt.current
      onEvent({
        type: 'screen_time',
        label: `${formatDuration(duration)} on ${previousScreen.current}`,
        detail: `${previousScreen.current} (${duration}ms)`,
        duration_ms: duration,
        screen: previousScreen.current,
        time: now(),
      })
      previousScreen.current = screen
      screenEnteredAt.current = Date.now()
    }
  }, [screen])

  const nav = (target) => {
    onScreenChange(target)
    onEvent({ type: 'screen_view', label: `Viewed ${target}`, detail: target, time: now() })
  }

  const screens = {
    home: <HomeScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    invest: <InvestScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    loan: <LoanScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    help: <HelpScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
        {screens[screen] || screens.home}
      </div>

      {/* Bottom nav */}
      <div className="flex-shrink-0 flex justify-around items-center px-6 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'invest', icon: '📈', label: 'Invest' },
          { id: 'loan', icon: '💳', label: 'Loans' },
          { id: 'help', icon: '❓', label: 'Help' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => nav(tab.id)}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${screen === tab.id ? 'text-violet-600' : 'text-gray-400'}`}
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

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}
