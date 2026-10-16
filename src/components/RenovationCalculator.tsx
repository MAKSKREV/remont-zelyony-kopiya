import React, { useState, useMemo } from 'react';
import { Check, ArrowRight, Info } from 'lucide-react';

interface RenovationCalculatorProps {
  onApplyEstimate: (estimateData: {
    repairType: string;
    area: number;
    totalCost: number;
    materialsCost: number;
    duration: string;
  }) => void;
}

export const RenovationCalculator: React.FC<RenovationCalculatorProps> = ({ onApplyEstimate }) => {
  const [area, setArea] = useState<number>(65);
  const [propertyType, setPropertyType] = useState<'new' | 'secondary' | 'house'>('new');
  const [repairType, setRepairType] = useState<'cosmetic' | 'standard' | 'designer'>('standard');
  const [rooms, setRooms] = useState<string>('2-к');

  const [includeDesign, setIncludeDesign] = useState<boolean>(true);
  const [includeUtilities, setIncludeUtilities] = useState<boolean>(true);
  const [includeWarmFloor, setIncludeWarmFloor] = useState<boolean>(false);
  const [includeAC, setIncludeAC] = useState<boolean>(false);

  const calculation = useMemo(() => {
    let baseRate = 22000;
    if (repairType === 'cosmetic') baseRate = 12000;
    if (repairType === 'designer') baseRate = 35000;

    let propertyFactor = 1.0;
    if (repairType === 'secondary') propertyFactor = 1.12;
    if (repairType === 'house') propertyFactor = 1.08;

    let totalLaborRate = baseRate * propertyFactor;

    if (includeDesign) totalLaborRate += 2500;
    if (includeUtilities) totalLaborRate += 3000;
    if (includeWarmFloor) totalLaborRate += 1500;

    const laborCost = Math.round(area * totalLaborRate);
    const acCost = includeAC ? 80000 : 0;
    const finalLaborCost = laborCost + acCost;

    const materialRatio = repairType === 'designer' ? 0.75 : repairType === 'standard' ? 0.6 : 0.45;
    const materialsCost = Math.round(finalLaborCost * materialRatio);
    const totalEstimate = finalLaborCost + materialsCost;

    let durationMonths = 2;
    if (area > 40) durationMonths = 2.5;
    if (area > 70) durationMonths = 3.5;
    if (area > 100) durationMonths = 4.5;
    if (area > 150) durationMonths = 6;
    if (repairType === 'designer') durationMonths += 1;

    return {
      laborCost: finalLaborCost,
      materialsCost,
      totalEstimate,
      duration: `${durationMonths} мес.`,
    };
  }, [area, propertyType, repairType, includeDesign, includeUtilities, includeWarmFloor, includeAC]);

  const sliderPercent = Math.round(((area - 20) / (200 - 20)) * 100);

  const getRepairTypeName = () => {
    if (repairType === 'cosmetic') return 'Косметический';
    if (repairType === 'standard') return 'Капитальный';
    return 'Дизайнерский';
  };

  const handleFixEstimate = () => {
    onApplyEstimate({
      repairType: getRepairTypeName(),
      area,
      totalCost: calculation.totalEstimate,
      materialsCost: calculation.materialsCost,
      duration: calculation.duration,
    });
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 max-w-[1440px] mx-auto" id="calculator">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="font-inter font-bold text-xs uppercase tracking-widest text-[#0369a1] block mb-3">
          ОНЛАЙН-РАСЧЕТ
        </span>
        <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-[#181f21] mb-4">
          Калькулятор стоимости ремонта
        </h2>
        <p className="font-inter text-[#434749] text-base">
          Узнайте предварительную стоимость работ и материалов с точностью до 95% за 1 минуту
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-8">
          <div>
            <label className="font-montserrat font-bold text-xs text-[#181f21] uppercase tracking-wider block mb-3">
              1. Тип объекта
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'new', label: 'Новостройка' },
                { id: 'secondary', label: 'Вторичка' },
                { id: 'house', label: 'Дом / Коттедж' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPropertyType(item.id as any)}
                  className={`py-3 px-2 text-xs sm:text-sm font-montserrat font-bold rounded border transition-all duration-200 cursor-pointer text-center ${
                    propertyType === item.id
                      ? 'bg-[#0284c7] text-white border-[#0284c7]'
                      : 'bg-[#f9f9f9] text-[#434749] border-[#E2E8F0] hover:border-[#0284c7]/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-montserrat font-bold text-xs text-[#181f21] uppercase tracking-wider block mb-3">
              2. Класс ремонта
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'cosmetic', title: 'Косметический', price: 'от 12 000 ₽/м²' },
                { id: 'standard', title: 'Капитальный', price: 'от 22 000 ₽/м²', tag: 'Популярный' },
                { id: 'designer', title: 'Дизайнерский', price: 'от 35 000 ₽/м²' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRepairType(item.id as any)}
                  className={`p-4 rounded border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    repairType === item.id
                      ? 'bg-[#eff6ff] border-[#0284c7] ring-1 ring-[#0284c7]/30'
                      : 'bg-[#f9f9f9] border-[#E2E8F0] hover:border-[#0284c7]/50'
                  }`}
                >
                  {item.tag && (
                    <span className="absolute -top-2.5 right-3 bg-[#0284c7] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  )}
                  <div>
                    <span className="font-montserrat font-bold text-sm text-[#181f21] block mb-1">
                      {item.title}
                    </span>
                    <span className="font-inter text-xs text-[#434749] block">
                      {item.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="font-montserrat font-bold text-xs text-[#181f21] uppercase tracking-wider">
                3. Площадь объекта (м²)
              </label>
              <div className="flex items-center gap-1 bg-[#f3f3f4] px-3 py-1 rounded border border-[#E2E8F0]">
                <input
                  type="number"
                  min="15"
                  max="300"
                  value={area}
                  onChange={(e) => setArea(Math.max(15, Math.min(300, Number(e.target.value))))}
                  className="w-14 font-montserrat font-bold text-base text-[#181f21] text-right bg-transparent outline-none"
                />
                <span className="font-montserrat font-bold text-sm text-[#434749]">м²</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-[#0284c7] rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${sliderPercent}%` }}
                />
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="1"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                style={{ margin: 0 }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#0284c7] rounded-full shadow pointer-events-none transition-all duration-200 ease-out"
                style={{
                  left: `calc(${sliderPercent}% - 10px)`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#747879] mt-3 font-inter">
              <span>20 м²</span>
              <span className="text-[#0284c7] font-bold">{area} м²</span>
              <span>200+ м²</span>
            </div>
          </div>

          <div>
            <label className="font-montserrat font-bold text-xs text-[#181f21] uppercase tracking-wider block mb-3">
              4. Количество комнат
            </label>
            <div className="flex flex-wrap gap-2">
              {['Студия', '1-к', '2-к', '3-к', '4+ комнат'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRooms(r)}
                  className={`px-4 py-2 text-xs font-montserrat font-bold rounded border transition-all duration-200 cursor-pointer ${
                    rooms === r
                      ? 'bg-[#0284c7] text-white border-[#0284c7]'
                      : 'bg-[#f9f9f9] text-[#434749] border-[#E2E8F0] hover:border-[#0284c7]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-montserrat font-bold text-xs text-[#181f21] uppercase tracking-wider block mb-3">
              5. Дополнительные опции
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { checked: includeDesign, set: setIncludeDesign, label: '3D Дизайн-проект', price: '+2 500 ₽/м²' },
                { checked: includeUtilities, set: setIncludeUtilities, label: 'Замена сантехники и электрики', price: '+3 000 ₽/м²' },
                { checked: includeWarmFloor, set: setIncludeWarmFloor, label: 'Монтаж теплого пола', price: '+1 500 ₽/м²' },
                { checked: includeAC, set: setIncludeAC, label: 'Кондиционирование', price: '+80 000 ₽' },
              ].map((opt, i) => (
                <label key={i} className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all duration-200 ${
                  opt.checked
                    ? 'border-[#0284c7]/40 bg-[#eff6ff]'
                    : 'border-[#E2E8F0] bg-[#f9f9f9] hover:bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="w-4 h-4 accent-[#0284c7] rounded"
                  />
                  <div>
                    <p className="font-bold text-[#181f21]">{opt.label}</p>
                    <p className="text-[#747879]">{opt.price}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#181f21] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#0284c7]/20 text-[#38bdf8] text-xs font-montserrat font-bold uppercase px-3 py-1 rounded mb-6">
              <span>Предварительный расчет</span>
            </div>

            <h3 className="font-montserrat font-bold text-2xl text-white mb-6">
              Итоговая смета объекта
            </h3>

            <div className="space-y-0 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-white/10 text-sm">
                <span className="text-[#c1c8ca]">Работы и монтаж:</span>
                <span className="font-montserrat font-bold text-white">
                  {calculation.laborCost.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10 text-sm">
                <span className="text-[#c1c8ca]">Черновые материалы:</span>
                <span className="font-montserrat font-bold text-white">
                  {calculation.materialsCost.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10 text-sm">
                <span className="text-[#c1c8ca]">Срок выполнения:</span>
                <span className="font-montserrat font-bold text-[#38bdf8]">
                  ~ {calculation.duration}
                </span>
              </div>
            </div>

            <div className="bg-[#2d3436] p-5 rounded border border-white/10 mb-8">
              <span className="text-xs uppercase text-[#959c9f] font-montserrat font-bold block mb-1">
                Ориентировочно под ключ:
              </span>
              <span className="font-montserrat font-extrabold text-3xl sm:text-4xl text-white">
                {calculation.totalEstimate.toLocaleString('ru-RU')} ₽
              </span>
              <p className="text-[11px] text-[#959c9f] mt-2">
                * Включает работы + черновые материалы. Финальная стоимость фиксируется в договоре.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-[#959c9f] mb-4">
              <Info className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <span>При отправке заявки из калькулятора действует скидка 5% на работы!</span>
            </div>

            <button
              onClick={handleFixEstimate}
              className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-montserrat font-bold text-sm uppercase py-4 rounded flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
              id="calc-fix-estimate-btn"
            >
              <span>Зафиксировать расчет и скидку 5%</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
