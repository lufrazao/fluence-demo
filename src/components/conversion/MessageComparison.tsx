import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import type { Lead } from '../../data/leads';

interface MessageComparisonProps {
  lead: Lead;
}

const MessageComparison: React.FC<MessageComparisonProps> = ({ lead }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lead.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Before — Standard Message */}
        <div className="bg-white/5 rounded-xl border-2 border-white/10 p-6 relative opacity-75">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
              <X size={14} className="text-gray-400" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mensagem Padrão</span>
          </div>

          <h3 className="text-lg font-bold text-gray-300 mb-3">{lead.standardMessage.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{lead.standardMessage.body}</p>

          <button className="w-full py-2.5 rounded-lg bg-gray-700 text-gray-400 font-semibold text-sm cursor-default">
            {lead.standardMessage.cta}
          </button>

          <p className="text-xs text-gray-600 text-center mt-4 italic">
            Sem personalização comportamental
          </p>
        </div>

        {/* After — Adapted Message */}
        <div className="bg-gray-900 rounded-xl border-2 border-primary-500 p-6 relative shadow-lg shadow-primary-500/10">
          <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            FLUENCE
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-primary-400" />
            </div>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Mensagem Adaptada</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-3">{lead.adaptedMessage.title}</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">{lead.adaptedMessage.body}</p>

          <button className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20">
            {lead.adaptedMessage.cta}
          </button>

          {/* Reasoning */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 italic leading-relaxed">
              💡 {lead.adaptedMessage.reasoning}
            </p>
          </div>

          {/* Highlight badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lead.adaptedMessage.highlights.map((h) => (
              <span
                key={h}
                className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-medium"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessageComparison;
