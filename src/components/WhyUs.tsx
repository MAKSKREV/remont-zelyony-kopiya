import React, { useState } from 'react';
import { WORKER_IMAGE } from '../data/mockData';
import { ShieldCheck, Camera, Award, CheckCircle } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guarantees' | 'control' | 'team'>('guarantees');

  return (
    <section className="bg-[#F5F6F7] py-20 md:py-28" id="why-us">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="font-inter font-bold text-xs uppercase tracking-widest text-[#0369a1] block mb-4">ПОЧЕМУ МЫ</span>
            <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-[#181f21] mb-6">Надежность, проверенная временем</h2>
            <p className="font-inter text-base text-[#434749] leading-relaxed mb-10">
              Мы не просто делаем ремонт, мы создаем пространство для комфортной жизни. Наш подход основан на прозрачности процессов, абсолютной фиксации стоимости в договоре и безупречном качестве исполнения на каждом этапе.
            </p>

            <div className="mb-10 bg-white p-2 rounded border border-[#E2E8F0] shadow-sm">
              <div className="flex border-b border-[#E2E8F0] mb-4">
                {[
                  { id: 'guarantees' as const, label: 'Гарантии' },
                  { id: 'control' as const, label: 'Технадзор 24/7' },
                  { id: 'team' as const, label: 'Мастера' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-montserrat font-bold transition-all cursor-pointer border-b-2 ${
                      activeTab === tab.id ? 'border-[#0284c7] text-[#0284c7]' : 'border-transparent text-[#434749] hover:text-[#181f21]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-3 text-xs sm:text-sm text-[#434749] leading-relaxed">
                {activeTab === 'guarantees' && (
                  <div className="space-y-2 animate-fadeIn">
                    <p className="flex items-center gap-2 font-medium text-[#181f21]"><ShieldCheck className="w-4 h-4 text-[#0284c7]" /> 5 лет официальной гарантии на все виды работ</p>
                    <p className="text-gray-600">Страхование объекта от ущерба перед третьими лицами на весь период ремонта.</p>
                  </div>
                )}
                {activeTab === 'control' && (
                  <div className="space-y-2 animate-fadeIn">
                    <p className="flex items-center gap-2 font-medium text-[#181f21]"><Camera className="w-4 h-4 text-[#10B981]" /> Фото и видеоотчеты каждые 2 дня</p>
                    <p className="text-gray-600">Контроль соблюдения технологий СНиП независимым инспектором службы качества.</p>
                  </div>
                )}
                {activeTab === 'team' && (
                  <div className="space-y-2 animate-fadeIn">
                    <p className="flex items-center gap-2 font-medium text-[#181f21]"><Award className="w-4 h-4 text-[#0284c7]" /> Узкопрофильные специалисты РФ</p>
                    <p className="text-gray-600">Электрики с группами допуска, аттестованные сантехники Rehau и штукатуры 5+ разряда.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-[#E2E8F0] pt-8">
              <div>
                <div className="font-montserrat font-extrabold text-4xl sm:text-5xl text-[#181f21] mb-2 tracking-tight">10+</div>
                <div className="font-inter text-sm text-[#434749]">Лет опыта на рынке Москвы и МО</div>
              </div>
              <div>
                <div className="font-montserrat font-extrabold text-4xl sm:text-5xl text-[#181f21] mb-2 tracking-tight">500+</div>
                <div className="font-inter text-sm text-[#434749]">Реализованных объектов под ключ</div>
              </div>
            </div>
          </div>

          <div className="relative h-[480px] sm:h-[580px] rounded-lg overflow-hidden shadow-lg border border-[#E2E8F0] group">
            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${WORKER_IMAGE}')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded border border-white/50 shadow-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-[#0284c7] shrink-0" />
                <div>
                  <p className="font-montserrat font-bold text-sm text-[#181f21]">Лазерный контроль геометрии</p>
                  <p className="font-inter text-xs text-[#434749]">Отклонения стен не превышают 1 мм на 3 метра длины</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
