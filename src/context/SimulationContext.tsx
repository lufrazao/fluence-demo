import React, { createContext, useContext, useState, useCallback } from 'react';
import type { VisibleTrait, VisiblePattern, AppEvent } from '../types/simulation';

interface SimulationState {
  visibleTraits: VisibleTrait[];
  visiblePatterns: VisiblePattern[];
  detectedPatternKeys: Set<string>;
  events: AppEvent[];
  hasProfile: boolean;
  activeDemo: 'fintech' | 'ecommerce';
}

interface SimulationContextValue extends SimulationState {
  updateProfile: (data: Omit<SimulationState, 'hasProfile'>) => void;
  resetProfile: () => void;
}

const defaultState: SimulationState = {
  visibleTraits: [],
  visiblePatterns: [],
  detectedPatternKeys: new Set(),
  events: [],
  hasProfile: false,
  activeDemo: 'fintech',
};

const SimulationContext = createContext<SimulationContextValue>({
  ...defaultState,
  updateProfile: () => {},
  resetProfile: () => {},
});

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulationState>(defaultState);

  const updateProfile = useCallback(
    (data: Omit<SimulationState, 'hasProfile'>) => {
      setState({
        ...data,
        hasProfile: data.visibleTraits.length > 0 || data.visiblePatterns.length > 0,
      });
    },
    []
  );

  const resetProfile = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <SimulationContext.Provider value={{ ...state, updateProfile, resetProfile }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);
