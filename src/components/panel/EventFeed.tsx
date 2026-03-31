import React from 'react';
import type { AppEvent } from '../../types/simulation';

const TYPE_COLORS: Record<string, string> = {
  screen_view: 'bg-blue-400',
  screen_time: 'bg-emerald-400',
  balance_check: 'bg-yellow-400',
  form_interaction: 'bg-purple-400',
  form_abandoned: 'bg-orange-400',
  help_accessed: 'bg-red-400',
  transaction: 'bg-green-400',
  transaction_click: 'bg-lime-400',
  search: 'bg-cyan-400',
  abandonment: 'bg-orange-400',
  click: 'bg-indigo-400',
  quick_action: 'bg-violet-400',
  investment_click: 'bg-teal-400',
  notification_click: 'bg-amber-400',
  scroll_depth: 'bg-sky-400',
  cart: 'bg-pink-400',
  default: 'bg-gray-400',
};

interface EventFeedProps {
  events: AppEvent[];
}

const EventFeed: React.FC<EventFeedProps> = ({ events }) => {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Eventos ao Vivo</h3>
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        {events.length === 0 && (
          <p className="text-xs text-gray-500 italic">Interaja com o app para ver eventos...</p>
        )}
        {events.map((event, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs animate-slide-up"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className={`event-dot mt-1 flex-shrink-0 ${TYPE_COLORS[event.type] || TYPE_COLORS.default}`} />
            <div className="min-w-0">
              <span className="text-gray-300 font-medium">{event.label}</span>
              {event.detail && (
                <span className="text-gray-500 ml-1">{'\u00B7'} {event.detail}</span>
              )}
            </div>
            <span className="text-gray-600 ml-auto flex-shrink-0 tabular-nums">{event.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventFeed;
