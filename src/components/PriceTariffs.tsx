import React from 'react';
import { PRICE_TIERS } from '../data/mockData';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface PriceTariffsProps {
  onSelectTier: (tierTitle: string) => void;
}

export const PriceTariffs: React.FC<PriceTariffsProps> = ({ onSelectTier }) => {
  return (
    <section className="bg-[#F5F6F7] py-20 md:py-28" id="prices">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-inter font-bold text-xs uppercase tracking-widest text-[#0369a1] block mb-3">
            ТАРИФЫ
          </span>
          <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-[#181f21] mb-4">
            Прозрачная стоимость работ
          </h2>
          <p className="font-inter text-[#434749] text-base">
            Фиксированная расценка за квадратный метр. Без скрытых платежей и сметных сюрпризов.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-lg p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                tier.isPopular
                  ? 'border-[#0284c7] shadow-xl ring-2 ring-[#0284c7]/30 lg:-translate-y-2'
                  : 'border-[#E2E8F0] shadow-sm hover:shadow-lg'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0284c7] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-sm">
                  {tier.badge}
                </div>
              )}

              <div>
                <h3 className="font-montserrat font-bold text-2xl text-[#181f21] mb-2 text-center">
                  {tier.title}
                </h3>

                <div className="text-center my-6 py-4 bg-[#f9f9f9] rounded border border-[#E2E8F0]">
                  <span className="text-xs uppercase text-[#747879] font-bold block mb-1">
                    Стоимость работ
                  </span>
                  <span className="font-montserrat font-extrabold text-3xl sm:text-4xl text-[#181f21]">
                    от {tier.pricePerMeter.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-xs text-[#747879] block mt-0.5">/ м² площади пола</span>
                </div>

                <p className="font-inter text-sm text-[#434749] mb-6 leading-relaxed">
                  {tier.description}
                </p>

                <div className="space-y-3 mb-8">
                  <span className="font-montserrat font-bold text-xs uppercase text-[#181f21] tracking-wider block mb-2">
                    В стоимость входит:
                  </span>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#434749]">
                      <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="p-3 bg-[#f3f3f4] rounded text-[11px] text-[#434749] mb-6 border border-[#E2E8F0]">
                  <strong>Материалы:</strong> {tier.materialsIncluded}
                </div>

                <button
                  onClick={() => onSelectTier(tier.title)}
                  className={`w-full font-montserrat font-bold text-sm uppercase py-4 rounded flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    tier.isPopular
                      ? 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-md'
                      : 'bg-[#181f21] hover:bg-[#2d3436] text-white'
                  }`}
                  id={`tariff-btn-${tier.id}`}
                >
                  <span>Выбрать тариф</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
