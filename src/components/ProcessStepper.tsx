import React, { useState } from 'react';
import { PROCESS_STEPS } from '../data/mockData';
import { Check, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export const ProcessStepper: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const toggleStep = (index: number) => setExpandedStep(expandedStep === index ? null : index);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 max-w-[1440px] mx-auto" id="process">
      <div className="text-center mb-20">
        <span className="font-inter font-bold text-xs uppercase tracking-widest text-[#0369a1] block mb-3">ЭТАПЫ РАБОТЫ</span>
        <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-[#181f21]">Как мы работаем</h2>
        <p className="font-inter text-[#434749] text-base mt-2 max-w-xl mx-auto">Прозрачный процесс от первого звонка до вручения ключей от готовой квартиры</p>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-[#E2E8F0] -z-10" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, idx) => {
            const isLast = idx === PROCESS_STEPS.length - 1;
            const isExpanded = expandedStep === idx;
            const isBlue = idx % 2 === 1;
            return (
              <div key={step.num} className="relative bg-white p-6 border border-[#E2E8F0] rounded-lg md:border-none md:p-0 md:bg-transparent group hover:bg-[#f3f3f4] transition-colors duration-300">
                <button
                  onClick={() => toggleStep(idx)}
                  className={`w-24 h-24 rounded-full border-4 border-[#f9f9f9] flex items-center justify-center mx-auto mb-6 shadow-sm z-10 relative transition-transform duration-300 group-hover:scale-105 cursor-pointer ${
                    isLast ? 'bg-[#0369a1]' : isBlue ? 'bg-[#e0f2fe]' : 'bg-[#f0fdf4]'
                  }`}
                  id={`process-step-node-${idx}`}
                >
                  {isLast ? (
                    <Check className="w-10 h-10 text-white" />
                  ) : (
                    <span className={`font-montserrat font-extrabold text-3xl ${isBlue ? 'text-[#0369a1]' : 'text-[#10B981]'}`}>{step.num}</span>
                  )}
                </button>
                <h3 className="font-montserrat font-bold text-2xl text-[#181f21] text-center mb-3">{step.title}</h3>
                <p className="font-inter text-sm text-[#434749] text-center leading-relaxed mb-4">{step.description}</p>
                <div className="text-center">
                  <button onClick={() => toggleStep(idx)} className={`inline-flex items-center gap-1 text-xs font-montserrat font-bold hover:underline cursor-pointer ${isBlue ? 'text-[#0369a1]' : 'text-[#10B981]'}`}>
                    <span>{isExpanded ? 'Свернуть' : 'Подробнее'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {isExpanded && (
                  <div className="mt-4 p-4 bg-[#f9f9f9] rounded border border-[#E2E8F0] text-left text-xs text-[#434749] leading-relaxed animate-fadeIn shadow-sm">
                    <p className="font-bold text-[#181f21] mb-2 flex items-center gap-1.5"><FileText className={`w-3.5 h-3.5 ${isBlue ? 'text-[#0369a1]' : 'text-[#10B981]'}`} /> Детали этапа:</p>
                    <p>{step.details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
