import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [legalModalText, setLegalModalText] = useState<string | null>(null);

  const handleLegalClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    if (type === 'privacy') {
      setLegalModalText(
        'Политика конфиденциальности ООО «СТРУКТУРА РЕМОНТ»:\n\nМы уважаем конфиденциальность ваших данных. Все данные, переданные через формы обратной связи (имя, телефон, параметры объекта), используются исключительно для связи с вашим личным инженером и подготовки коммерческого предложения. Мы гарантируем неразглашение и защиту персональных данных в соответствии с ФЗ-152.'
      );
    } else if (type === 'terms') {
      setLegalModalText(
        'Условия оказания услуг РемонтПросто:\n\n1. Каждая смета фиксируется в официальном договоре строительного подряда.\n2. Оплата производится поэтапно — по факту выполнения каждого обособленного объема работ.\n3. Срок гарантийных обязательств составляет 60 месяцев (5 лет) на все общестроительные, инженерные и отделочные работы.'
      );
    } else if (type === 'cookie') {
      setLegalModalText(
        'Использование Cookie:\n\nСайт использует технические файлы cookie для корректной работы калькулятора сметы и сохранения параметров выбора. Продолжая использовать сайт, вы выражаете согласие с их обработкой.'
      );
    } else {
      setLegalModalText(
        'Карта сайта РемонтПросто:\n\n• Главная / Герой\n• Комплексные услуги\n• Интерактивный калькулятор сметы\n• Почему мы и Технадзор\n• Портфолио выполненных объектов\n• Тарифные планы и расценки\n• Заявка на выезд инженера'
      );
    }
  };

  return (
    <footer className="bg-[#f3f3f4] text-[#1a1c1c] font-inter text-sm w-full pt-20 pb-12 border-t border-[#c3c7c8]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 max-w-[1440px] mx-auto mb-12">
        <div className="col-span-1 md:col-span-1">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hero');
            }}
            className="mb-3 block hover:opacity-80 transition-opacity"
          >
            <Logo size="sm" />
          </a>
          <p className="text-xs text-[#434749] leading-relaxed">
            Комплексный ремонт и отделка квартир под ключ в Москве и МО с 5-летней гарантией.
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row gap-4 md:gap-8 justify-end items-start md:items-center font-medium">
          <a
            href="#"
            onClick={(e) => handleLegalClick(e, 'privacy')}
            className="text-[#434749] hover:text-[#0284c7] transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            onClick={(e) => handleLegalClick(e, 'terms')}
            className="text-[#434749] hover:text-[#0284c7] transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            onClick={(e) => handleLegalClick(e, 'cookie')}
            className="text-[#434749] hover:text-[#0284c7] transition-colors"
          >
            Cookie Policy
          </a>
          <a
            href="#"
            onClick={(e) => handleLegalClick(e, 'sitemap')}
            className="text-[#434749] hover:text-[#0284c7] transition-colors"
          >
            Sitemap
          </a>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 max-w-[1440px] mx-auto text-[#434749] text-xs border-t border-[#c3c7c8]/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>© 2024 Ремонт под ключ. Все права защищены.</div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0284c7]" />
          <span>Лицензии и допуски СРО строителей №СТ-84920</span>
        </div>
      </div>

      {legalModalText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-[#E2E8F0]">
            <button
              onClick={() => setLegalModalText(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-montserrat font-bold text-xl text-[#181f21] mb-4">
              Информация РемонтПросто
            </h3>

            <p className="font-inter text-sm text-[#434749] whitespace-pre-line leading-relaxed mb-6">
              {legalModalText}
            </p>

            <button
              onClick={() => setLegalModalText(null)}
              className="w-full bg-[#181f21] text-white font-montserrat font-bold text-xs uppercase py-3 rounded cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
