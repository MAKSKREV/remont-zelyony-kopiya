import React, { useState } from 'react';
import { SERVICES } from '../data/mockData';
import { ServiceItem } from '../types';
import { Ruler, HardHat, Paintbrush, ChevronRight, Check, X } from 'lucide-react';

interface ServicesBentoProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

const ICONS = [Ruler, HardHat, Paintbrush];

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onSelectServiceForQuote }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 max-w-[1440px] mx-auto" id="services">
      <div className="mb-14">
        <span className="font-inter font-bold text-xs uppercase tracking-widest text-[#0369a1] block mb-3">НАШИ УСЛУГИ</span>
        <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-[#181f21]">Комплексный подход</h2>
        <p className="font-inter text-[#434749] text-base mt-2 max-w-xl">Полный цикл ремонтных и отделочных работ без посредников и переплат</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {SERVICES.map((service, i) => {
          const Icon = ICONS[i] || Ruler;
          const isBlue = i === 1;
          return (
            <div key={service.id} className="bg-[#f9f9f9] rounded-lg border border-[#E2E8F0] p-8 group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#181f21]/30 relative">
              <div>
                <div className={`mb-6 w-12 h-12 flex items-center justify-center rounded transition-colors duration-300 ${
                  isBlue
                    ? 'bg-[#e0f2fe] text-[#0369a1] group-hover:bg-[#0284c7] group-hover:text-white'
                    : 'bg-[#f0fdf4] text-[#0D7A5F] group-hover:bg-[#10B981] group-hover:text-white'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-2xl text-[#181f21] mb-4">{service.title}</h3>
                <p className="font-inter text-base text-[#434749] leading-relaxed mb-6">{service.shortDesc}</p>
              </div>
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <button onClick={() => setSelectedService(service)} className="font-montserrat font-bold text-sm text-[#181f21] hover:text-[#0284c7] inline-flex items-center gap-1 cursor-pointer transition-colors">
                  <span>Состав работ</span><ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => onSelectServiceForQuote(service.title)} className={`text-xs font-montserrat font-bold px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  isBlue ? 'text-[#0369a1] bg-[#e0f2fe]/60 hover:bg-[#0284c7] hover:text-white' : 'text-[#0D7A5F] bg-[#d1fae5]/60 hover:bg-[#10B981] hover:text-white'
                }`}>
                  Заказать
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-[#E2E8F0]">
            <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 text-[#747879] hover:text-[#181f21] rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat font-bold text-2xl text-[#181f21]">{selectedService.title}</h3>
            </div>
            <p className="font-inter text-base text-[#434749] mb-6 leading-relaxed">{selectedService.fullDesc}</p>
            <div className="mb-6">
              <h4 className="font-montserrat font-bold text-sm text-[#181f21] uppercase tracking-wider mb-3">Что входит в стоимость:</h4>
              <ul className="space-y-2.5">
                {selectedService.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#434749]">
                    <Check className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-8 p-4 bg-[#f3f3f4] rounded border border-[#E2E8F0]">
              <h4 className="font-montserrat font-bold text-xs uppercase text-[#181f21] mb-2">Используемые материалы и оборудование:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.materials.map((mat, idx) => (
                  <span key={idx} className="bg-white px-2.5 py-1 text-xs font-semibold text-[#434749] rounded border border-[#E2E8F0]">{mat}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E2E8F0]">
              <button onClick={() => { const t = selectedService.title; setSelectedService(null); onSelectServiceForQuote(t); }} className="flex-1 bg-[#0369a1] hover:bg-[#0284c7] text-white font-montserrat font-bold text-sm uppercase py-3.5 rounded text-center transition-colors cursor-pointer">
                Рассчитать смету на {selectedService.title.toLowerCase()}
              </button>
              <button onClick={() => setSelectedService(null)} className="px-6 py-3.5 border border-[#747879]/40 text-[#181f21] font-montserrat font-bold text-sm uppercase rounded hover:bg-gray-50 transition-colors cursor-pointer">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
