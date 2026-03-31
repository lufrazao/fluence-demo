import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { Lead } from '../../data/leads';

interface ProfileSelectorProps {
  leads: Lead[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ leads, selectedId, onSelect }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {leads.map((lead, index) => (
        <motion.button
          key={lead.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          onClick={() => onSelect(lead.id)}
          className={clsx(
            'flex-shrink-0 text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 min-w-[180px]',
            selectedId === lead.id
              ? 'border-primary-500/50 bg-primary-500/10 shadow-md shadow-primary-500/10'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{lead.avatar}</span>
            <div>
              <div className="font-semibold text-white text-sm">{lead.name}</div>
              <span className={clsx(
                'text-xs font-medium px-1.5 py-0.5 rounded-full',
                lead.behavioralProfile.decisionStyleColor
              )}>
                {lead.behavioralProfile.decisionStyle}
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ProfileSelector;
