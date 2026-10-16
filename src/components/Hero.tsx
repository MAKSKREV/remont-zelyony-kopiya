import React from 'react';
import { HERO_IMAGE } from '../data/mockData';
import { Shield, Clock, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onCalculateClick: () => void;
  onOpenCallback: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCalculateClick, onOpenCallback }) => {
  return (
    <section className="relative w-full min-h-[820px] flex items-center bg-[#e2e2e2] overflow-hidden" id="hero">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center transition-all duration-700 scale-105" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f9f9f9] via-[#f9f9f9]/85 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-16 md:py-24">
        <div className="max-w-3xl lg:max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#181f21] text-white text-xs font-montserrat font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
            <span>Официальный подрядчик в Москве и МО</span>
          </div>

          <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl lg:text-[64px] text-[#1a1c1c] leading-[1.1] tracking-tight mb-6">
            Ремонт квартир под ключ в Москве с гарантией 5 лет
          </h1>

          <p className="font-inter font-normal text-base sm:text-lg text-[#434749] leading-relaxed mb-10 max-w-2xl">
            Профессиональный подход к каждому метру. Фиксированная смета, строгий контроль качества и соблюдение сроков по официальному договору.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <button
              onClick={onCalculateClick}
              className="bg-[#0369a1] hover:bg-[#0284c7] text-white font-montserrat font-bold text-base uppercase h-[56px] px-8 rounded flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer group"
              id="hero-cta-calculate"
            >
              <span>Рассчитать стоимость</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenCallback}
              className="bg-white/90 hover:bg-white text-[#1a1c1c] border border-[#747879]/40 hover:border-[#1a1c1c] font-montserrat font-bold text-base uppercase h-[56px] px-8 rounded flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
              id="hero-cta-callback"
            >
              Вызов инженера
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#747879]/20">
            {[
              { icon: Shield, title: 'Гарантия 5 лет', sub: 'По договору' },
              { icon: CheckCircle2, title: 'Фикс. смета', sub: 'Без доплат' },
              { icon: Clock, title: 'Соблюдение сроков', sub: 'Штраф за день' },
              { icon: Calculator, title: 'Оплата по факту', sub: 'Поэтапно' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${i % 2 === 0 ? 'bg-[#0284c7]/10 text-[#0284c7]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-montserrat font-bold text-xs text-[#1a1c1c]">{item.title}</p>
                  <p className="font-inter text-[11px] text-[#434749]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
