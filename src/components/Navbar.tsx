import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Calculator } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenCallback: () => void;
  onOpenAIConsultant: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCallback,
  onOpenAIConsultant,
  onNavigate,
  activeSection = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#f9f9f9]/95 backdrop-blur-md border-[#c3c7c8]/60 shadow-sm py-3'
          : 'bg-[#f9f9f9] border-[#c3c7c8] py-4'
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 max-w-[1440px] mx-auto gap-4">
        <a href="#" onClick={(e) => handleNavClick(e, 'hero')} className="hover:opacity-90 transition-opacity flex items-center shrink-0" id="nav-logo">
          <Logo size="md" />
        </a>

        <div className="hidden md:flex gap-3 lg:gap-5 xl:gap-8 items-center text-xs xl:text-sm font-montserrat font-bold whitespace-nowrap">
          {[
            { id: 'services', label: 'Услуги' },
            { id: 'why-us', label: 'Почему мы' },
            { id: 'portfolio', label: 'Портфолио' },
            { id: 'prices', label: 'Цены' },
            { id: 'contacts', label: 'Контакты' },
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`transition-all duration-200 border-b-2 pb-1 ${
                activeSection === link.id
                  ? 'text-[#0369a1] border-[#0369a1]'
                  : 'text-[#434749] border-transparent hover:text-[#0369a1] hover:border-[#0369a1]'
              }`}
              id={`nav-link-${link.id}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#calculator"
            onClick={(e) => handleNavClick(e, 'calculator')}
            className={`transition-all duration-200 border-b-2 pb-1 flex items-center gap-1 ${
              activeSection === 'calculator'
                ? 'text-[#0369a1] border-[#0369a1]'
                : 'text-[#434749] border-transparent hover:text-[#0369a1] hover:border-[#0369a1]'
            }`}
            id="nav-link-calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
            Калькулятор
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
          <div className="flex flex-col text-right whitespace-nowrap">
            <a href="tel:+18005550199" className="font-montserrat font-bold text-sm xl:text-base text-[#181f21] hover:text-[#0284c7] transition-colors flex items-center gap-1.5 justify-end" id="nav-phone-link">
              <Phone className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#0284c7] shrink-0" />
              <span>+7 800 555 0199</span>
            </a>
            <span className="text-[10px] xl:text-[11px] text-[#434749]">Москва и МО • Пн-Вс 9:00-21:00</span>
          </div>

          <button
            onClick={onOpenCallback}
            className="bg-transparent hover:bg-[#0284c7]/10 text-[#181f21] border border-[#181f21]/30 hover:border-[#0284c7] font-montserrat font-bold text-xs uppercase px-3.5 xl:px-4 py-2.5 rounded transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
            id="nav-callback-button"
          >
            Заказать звонок
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#181f21] hover:text-[#0284c7] transition-colors cursor-pointer"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f9f9f9] border-b border-[#c3c7c8] px-6 py-6 space-y-4 font-montserrat font-bold text-base animate-fadeIn">
          {['services', 'why-us', 'calculator', 'portfolio', 'prices', 'contacts'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleNavClick(e, id)}
              className="block text-[#181f21] hover:text-[#0284c7] py-2 border-b border-gray-200"
            >
              {id === 'calculator' ? (
                <span className="flex items-center justify-between">
                  <span>Калькулятор стоимости</span>
                  <Calculator className="w-4 h-4 text-[#0284c7]" />
                </span>
              ) : (
                { services: 'Услуги', 'why-us': 'Почему мы', portfolio: 'Портфолио', prices: 'Цены', contacts: 'Контакты' }[id]
              )}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <a href="tel:+18005550199" className="font-extrabold text-lg text-[#181f21] flex items-center gap-2 justify-center py-2 bg-gray-100 rounded">
              <Phone className="w-5 h-5 text-[#0284c7]" />
              +7 800 555 0199
            </a>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCallback(); }}
              className="w-full bg-[#0369a1] hover:bg-[#0284c7] text-white uppercase py-3 rounded font-bold text-sm tracking-wider cursor-pointer"
            >
              Заказать звонок
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
