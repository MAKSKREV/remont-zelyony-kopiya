import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesBento } from './components/ServicesBento';
import { WhyUs } from './components/WhyUs';
import { RenovationCalculator } from './components/RenovationCalculator';
import { ProcessStepper } from './components/ProcessStepper';
import { Portfolio } from './components/Portfolio';
import { PriceTariffs } from './components/PriceTariffs';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import { AIConsultantModal } from './components/AIConsultantModal';
import { CallbackModal } from './components/CallbackModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectItem, LeadFormData } from './types';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [aiConsultantOpen, setAiConsultantOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showChatHint, setShowChatHint] = useState(false);

  const [initialLeadData, setInitialLeadData] = useState<Partial<LeadFormData> | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setShowChatHint(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = elem.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setInitialLeadData({
      repairType: 'Капитальный',
      message: `Интересует услуга "${serviceTitle}". Хочу узнать подробности и получить сметный расчет.`,
    });
    scrollToSection('contacts');
  };

  const handleApplyEstimateFromCalc = (estimate: {
    repairType: string;
    area: number;
    totalCost: number;
    duration: string;
  }) => {
    setInitialLeadData({
      repairType: estimate.repairType,
      area: estimate.area,
      message: `Расчет из калькулятора: Площадь ${estimate.area} м², Тип: ${estimate.repairType}. Предварительная смета: ${estimate.totalCost.toLocaleString('ru-RU')} ₽ (~${estimate.duration}). Примените скидку 5%!`,
    });
    scrollToSection('contacts');
  };

  const handleSelectTier = (tierTitle: string) => {
    setInitialLeadData({
      repairType: tierTitle,
      message: `Хочу заказать ремонт по тарифу "${tierTitle}".`,
    });
    scrollToSection('contacts');
  };

  const handleRequestQuoteFromProject = (projectMessage: string) => {
    setInitialLeadData({
      message: projectMessage,
    });
    scrollToSection('contacts');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c] font-inter antialiased selection:bg-[#0284c7] selection:text-white">
      <Navbar
        onOpenCallback={() => setCallbackModalOpen(true)}
        onOpenAIConsultant={() => setAiConsultantOpen(true)}
        onNavigate={scrollToSection}
        activeSection={activeSection}
      />

      <main className="flex-grow">
        <Hero
          onCalculateClick={() => scrollToSection('calculator')}
          onOpenCallback={() => setCallbackModalOpen(true)}
        />

        <ServicesBento onSelectServiceForQuote={handleSelectServiceForQuote} />

        <WhyUs />

        <RenovationCalculator onApplyEstimate={handleApplyEstimateFromCalc} />

        <ProcessStepper />

        <Portfolio onSelectProject={(project) => setSelectedProject(project)} />

        <PriceTariffs onSelectTier={handleSelectTier} />

        <LeadForm
          initialData={initialLeadData}
          onClearInitialData={() => setInitialLeadData(undefined)}
        />
      </main>

      <Footer onNavigate={scrollToSection} />

      {/* Floating Chat Button */}
      {!aiConsultantOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          {showChatHint && (
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] px-4 py-3 max-w-[220px] animate-fadeIn relative">
              <button
                onClick={() => setShowChatHint(false)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E2E8F0] hover:bg-[#c3c7c8] rounded-full flex items-center justify-center text-[10px] text-[#747879] cursor-pointer transition-colors"
              >
                ×
              </button>
              <p className="text-xs text-[#181f21] font-inter leading-relaxed">
                👋 Нужна помощь с ремонтом? Спросите нашего ИИ-менеджера!
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setAiConsultantOpen(true);
              setShowChatHint(false);
            }}
            className="w-14 h-14 bg-gradient-to-br from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#024880] rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 group"
            id="floating-chat-btn"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      <AIConsultantModal
        isOpen={aiConsultantOpen}
        onClose={() => setAiConsultantOpen(false)}
        onRequestMeasurement={() => {
          setAiConsultantOpen(false);
          setCallbackModalOpen(true);
        }}
      />

      <CallbackModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onRequestQuote={handleRequestQuoteFromProject}
      />
    </div>
  );
}
