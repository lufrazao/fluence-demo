export interface AppEvent {
  type: string;
  label: string;
  detail?: string;
  time: string;
  duration_ms?: number;
  screen?: string;
  category?: string;
  price?: number;
  productId?: number;
  productName?: string;
}

export interface SignalRule {
  match: {
    type: string;
    detailIncludes?: string;
    labelIncludes?: string;
  };
  traits?: Record<string, number>;
  patterns?: Record<string, number>;
}

export interface TraitDef {
  label: string;
  labelNegative?: string;
  maxPoints: number;
}

export interface PatternDef {
  icon: string;
  name: string;
  description: string;
}

export interface MetricDef {
  label: string;
  before: string;
  after: string;
  delta: string;
  unlockedBy: string;
}

export interface MemoryData {
  userId: string;
  totalSessions: number;
  firstSeen: string;
  lastSeen: string;
  sessionHistory: { date: string; summary: string; duration: string }[];
  persistentTraits: { label: string; detail: string; trend: string; icon: string }[];
}

export interface PredictionDef {
  pattern: string;
  icon: string;
  label: string;
  getValue: (points: number) => string;
  getCurrentSignal: (events: AppEvent[]) => string;
  historicalContext: string;
}

export interface RecommendationDef {
  pattern: string;
  do: string;
  avoid: string;
}

export interface CommunicationStyle {
  tone: string;
  contentPriority: string[];
  avoid: string[];
}

export interface ApiOutputDef {
  userId: string;
  segment: { name: string; id: string; confidence?: number };
  predictions: PredictionDef[];
  recommendations: RecommendationDef[];
  communicationStyles: Record<string, CommunicationStyle>;
}

export interface VisibleTrait {
  key: string;
  label: string;
  confidence: number;
}

export interface VisiblePattern {
  key: string;
  icon: string;
  name: string;
  description: string;
}
