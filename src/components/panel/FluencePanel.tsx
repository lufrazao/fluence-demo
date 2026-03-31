import React from 'react';
import EventFeed from './EventFeed';
import UserMemory from './UserMemory';
import ProfileCard from './ProfileCard';
import ApiOutput from './ApiOutput';
import type { AppEvent, VisibleTrait, VisiblePattern, MemoryData, ApiOutputDef } from '../../types/simulation';

interface FluencePanelProps {
  events: AppEvent[];
  traits: VisibleTrait[];
  patterns: VisiblePattern[];
  detectedPatterns: Set<string>;
  apiOutput: ApiOutputDef;
  memory: MemoryData;
  patternPoints: Record<string, number>;
}

const FluencePanel: React.FC<FluencePanelProps> = ({ events, traits, patterns, detectedPatterns, apiOutput, memory, patternPoints }) => {
  const hasInteracted = events.length > 0;

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white">F</div>
        <span className="text-sm font-semibold text-white">Fluence Intelligence</span>
        {hasInteracted && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-mono">
            {events.length} sinais capturados
          </span>
        )}
      </div>

      {/* Responsive: 1 col on narrow, 2 cols when panel has enough width */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
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

        <div className="flex flex-col gap-3">
          <div className="glass-card p-4">
            <ApiOutput output={apiOutput} detectedPatterns={detectedPatterns} events={events} patternPoints={patternPoints} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluencePanel;
