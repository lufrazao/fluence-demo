import { leads } from './leads';
import type { Lead } from './leads';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function toSnakeCase(lead: Lead) {
  return {
    lead_id: lead.id,
    name: lead.name,
    age: lead.age,
    source: lead.source,
    product_interest: lead.product,
    context: lead.context,
    computed_at: new Date().toISOString(),
    model_version: 'fluence-conv-v2.5.0',
  };
}

export const conversionAPI = {
  getLeadProfile: async (leadId: string) => {
    await delay(280);
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    return {
      ...toSnakeCase(lead),
      behavioral_profile: {
        decision_style: lead.behavioralProfile.decisionStyle,
        risk_sensitivity: lead.behavioralProfile.riskSensitivity,
        trust_triggers: lead.behavioralProfile.trustTriggers,
        urgency_response: lead.behavioralProfile.urgencyResponse,
        information_need: lead.behavioralProfile.informationNeed,
        traits: lead.behavioralProfile.traits.map(t => ({
          label: t.label,
          score: t.value,
          max: 100,
        })),
        patterns_detected: lead.behavioralProfile.patterns.map(p => ({
          name: p.name,
          description: p.description,
        })),
      },
    };
  },

  getBehavioralAssessment: async (leadId: string) => {
    await delay(320);
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    return {
      lead_id: lead.id,
      assessment: {
        decision_style: lead.behavioralProfile.decisionStyle,
        risk_sensitivity: {
          score: lead.behavioralProfile.riskSensitivity,
          level: lead.behavioralProfile.riskSensitivity > 70 ? 'alto' : lead.behavioralProfile.riskSensitivity > 40 ? 'medio' : 'baixo',
        },
        trust_triggers: lead.behavioralProfile.trustTriggers,
        information_need: lead.behavioralProfile.informationNeed,
        urgency_response: lead.behavioralProfile.urgencyResponse,
      },
      confidence: 0.87,
      signals_analyzed: 42,
      computed_at: new Date().toISOString(),
      model_version: 'fluence-conv-v2.5.0',
    };
  },

  getAdaptedMessage: async (leadId: string) => {
    await delay(350);
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    return {
      lead_id: lead.id,
      standard_message: {
        title: lead.standardMessage.title,
        body: lead.standardMessage.body,
        cta: lead.standardMessage.cta,
      },
      adapted_message: {
        title: lead.adaptedMessage.title,
        body: lead.adaptedMessage.body,
        cta: lead.adaptedMessage.cta,
        reasoning: lead.adaptedMessage.reasoning,
        adaptations_applied: lead.adaptedMessage.highlights,
      },
      expected_lift: `+${lead.conversionMetrics.lift}%`,
      computed_at: new Date().toISOString(),
      model_version: 'fluence-conv-v2.5.0',
    };
  },

  getConversionMetrics: async () => {
    await delay(200);
    return {
      summary: {
        avg_standard_rate: 3.2,
        avg_adapted_rate: 10.5,
        avg_lift_percent: 228,
        total_leads_analyzed: 14850,
      },
      by_profile: leads.map(l => ({
        profile: l.behavioralProfile.decisionStyle,
        standard_rate: l.conversionMetrics.standardRate,
        adapted_rate: l.conversionMetrics.adaptedRate,
        lift_percent: l.conversionMetrics.lift,
      })),
      computed_at: new Date().toISOString(),
      model_version: 'fluence-conv-v2.5.0',
    };
  },
};
