import EventFeed from './EventFeed'
import UserMemory from './UserMemory'
import ProfileCard from './ProfileCard'
import ApiOutput from './ApiOutput'
import MetricsCard from './MetricsCard'

export default function FluencePanel({ events, traits, patterns, metrics, detectedPatterns, apiOutput, memory, patternPoints }) {
  const hasInteracted = events.length > 0

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white">F</div>
        <span className="text-sm font-semibold text-white">Fluence Intelligence</span>
        {hasInteracted && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-mono">
            {events.length} signals captured
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column: Live signals */}
        <div className="flex flex-col gap-3">
          <div className="glass-card p-4">
            <EventFeed events={events} />
          </div>

          <div className="glass-card p-4">
            <UserMemory memory={memory} hasInteracted={hasInteracted} />
          </div>

          <div className="glass-card p-4">
            <ProfileCard traits={traits} patterns={patterns} />
          </div>
        </div>

        {/* Right column: API output & business impact */}
        <div className="flex flex-col gap-3">
          <div className="glass-card p-4">
            <ApiOutput output={apiOutput} detectedPatterns={detectedPatterns} events={events} patternPoints={patternPoints} />
          </div>

          <div className="glass-card p-4">
            <MetricsCard metrics={metrics} fluenceEnabled={true} detectedPatterns={detectedPatterns} />
          </div>
        </div>
      </div>
    </div>
  )
}
