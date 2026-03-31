import React, { useRef, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import InvestScreen from './screens/InvestScreen';
import LoanScreen from './screens/LoanScreen';
import HelpScreen from './screens/HelpScreen';
import type { AppEvent } from '../../types/simulation';

interface FintechDemoProps {
  fluenceEnabled: boolean;
  onEvent: (event: AppEvent) => void;
  screen: string;
  onScreenChange: (screen: string) => void;
}

function now(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

const FintechDemo: React.FC<FintechDemoProps> = ({ fluenceEnabled, onEvent, screen, onScreenChange }) => {
  const screenEnteredAt = useRef(Date.now());
  const previousScreen = useRef(screen);
  const scrollThresholds = useRef(new Set<number>());

  useEffect(() => {
    scrollThresholds.current = new Set();
  }, [screen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.target as HTMLDivElement;
    if (el.scrollHeight <= el.clientHeight) return;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    for (const threshold of [25, 50, 75, 100]) {
      if (pct >= threshold && !scrollThresholds.current.has(threshold)) {
        scrollThresholds.current.add(threshold);
        onEvent({
          type: 'scroll_depth',
          label: `Scrolled ${threshold}% on ${screen}`,
          detail: `${screen} — ${threshold}%`,
          time: now(),
        });
      }
    }
  };

  useEffect(() => {
    if (previousScreen.current !== screen) {
      const duration = Date.now() - screenEnteredAt.current;
      onEvent({
        type: 'screen_time',
        label: `${formatDuration(duration)} on ${previousScreen.current}`,
        detail: `${previousScreen.current} (${duration}ms)`,
        duration_ms: duration,
        screen: previousScreen.current,
        time: now(),
      });
      previousScreen.current = screen;
      screenEnteredAt.current = Date.now();
    }
  }, [screen, onEvent]);

  const nav = (target: string) => {
    onScreenChange(target);
    onEvent({ type: 'screen_view', label: `Viewed ${target}`, detail: target, time: now() });
  };

  const screens: Record<string, React.ReactNode> = {
    home: <HomeScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    invest: <InvestScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    loan: <LoanScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
    help: <HelpScreen onNavigate={nav} onEvent={onEvent} fluenceEnabled={fluenceEnabled} />,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
        {screens[screen] || screens.home}
      </div>

      <div className="flex-shrink-0 flex justify-around items-center px-6 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        {[
          { id: 'home', icon: '\u{1F3E0}', label: 'Inicio' },
          { id: 'invest', icon: '\u{1F4C8}', label: 'Investir' },
          { id: 'loan', icon: '\u{1F4B3}', label: 'Credito' },
          { id: 'help', icon: '\u{2753}', label: 'Ajuda' },
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
  );
};

export default FintechDemo;
