import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Bell, Mail, MessageCircle } from 'lucide-react';
import type { Lead } from '../../data/leads';

interface ChannelPreviewProps {
  lead: Lead;
}

const channelConfig = [
  { key: 'onboarding' as const, label: 'Onboarding', icon: Smartphone, color: 'bg-blue-900/30 border-blue-500/20 text-blue-400' },
  { key: 'push' as const, label: 'Push', icon: Bell, color: 'bg-amber-900/30 border-amber-500/20 text-amber-400' },
  { key: 'email' as const, label: 'Email', icon: Mail, color: 'bg-violet-900/30 border-violet-500/20 text-violet-400' },
  { key: 'whatsapp' as const, label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-900/30 border-green-500/20 text-green-400' },
];

const ChannelPreview: React.FC<ChannelPreviewProps> = ({ lead }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {channelConfig.map((ch, i) => (
        <motion.div
          key={ch.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`rounded-xl border p-4 ${ch.color}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <ch.icon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{ch.label}</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">
            {lead.channels[ch.key]}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default ChannelPreview;
