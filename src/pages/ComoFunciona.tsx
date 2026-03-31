import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Fingerprint, Brain, Target, Zap } from 'lucide-react';

const ComoFunciona: React.FC = () => {
  const steps = [
    {
      icon: <Fingerprint size={32} className="text-blue-400" />,
      title: 'Captura do Lead',
      description: 'O lead interage com seu produto digital. Fluence captura sinais comportamentais em tempo real — sem coletar dados pessoais.',
      details: ['Sem PII necessário', 'Latência <10ms', 'Multi-canal (app, web, chat)'],
    },
    {
      icon: <Brain size={32} className="text-violet-400" />,
      title: 'Perfil Comportamental',
      description: 'Sinais são processados em um perfil comportamental: estilo de decisão, sensibilidade a risco e gatilhos de confiança.',
      details: ['50+ sinais extraídos', 'Atualização em tempo real', 'Análise contextual'],
    },
    {
      icon: <Target size={32} className="text-teal-400" />,
      title: 'Mensagem Adaptada',
      description: 'O perfil gera uma mensagem personalizada — tom, conteúdo e CTA otimizados para o estilo de decisão do lead.',
      details: ['Tom personalizado', 'CTA otimizado por perfil', 'Raciocínio explicável'],
    },
    {
      icon: <Zap size={32} className="text-amber-400" />,
      title: 'Conversão Inteligente',
      description: 'O lead recebe a comunicação certa, no momento certo, com a abordagem certa. Conversão aumenta 2-4x.',
      details: ['Lift médio de +228%', 'ROI mensurável', 'Feedback loop contínuo'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">De Sinais a Conversão</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Como o Fluence transforma comportamento digital em mensagens que convertem — em milissegundos.
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-white/10 -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-gray-900 p-6 rounded-xl border border-white/10 relative group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-gray-800 border border-white/10 rounded-full flex items-center justify-center shadow-lg mb-6 mx-auto lg:mx-0 relative z-10">
                {step.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-3 text-center lg:text-left">{step.title}</h3>
              <p className="text-sm text-gray-400 mb-4 text-center lg:text-left leading-relaxed">
                {step.description}
              </p>

              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-center text-xs text-gray-500">
                    <ArrowRight size={10} className="mr-2 text-teal-400 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Flow Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-medium text-gray-300">
          <span className="bg-white/10 px-4 py-2 rounded-lg">Lead Interage</span>
          <ArrowRight size={16} className="text-primary-400 hidden md:block" />
          <span className="bg-white/10 px-4 py-2 rounded-lg">Sinais Capturados</span>
          <ArrowRight size={16} className="text-primary-400 hidden md:block" />
          <span className="bg-white/10 px-4 py-2 rounded-lg">Perfil Gerado</span>
          <ArrowRight size={16} className="text-primary-400 hidden md:block" />
          <span className="bg-white/10 px-4 py-2 rounded-lg">Mensagem Adaptada</span>
          <ArrowRight size={16} className="text-primary-400 hidden md:block" />
          <span className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-sm">+228% Conversão</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ComoFunciona;
