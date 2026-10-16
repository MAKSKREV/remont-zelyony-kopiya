import React, { useState, useEffect } from 'react';
import { LeadFormData } from '../types';
import { CheckCircle2, Phone, Send, ShieldCheck, X } from 'lucide-react';

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  onClearInitialData?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onClearInitialData }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [repairType, setRepairType] = useState('Капитальный');
  const [area, setArea] = useState<number | string>('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedLead, setSubmittedLead] = useState<{ leadNumber: string; message: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.repairType) setRepairType(initialData.repairType);
      if (initialData.area) setArea(initialData.area);
      if (initialData.message) setMessage(initialData.message);
    }
  }, [initialData]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setPhone('');
      return;
    }
    if (val.startsWith('7') || val.startsWith('8')) {
      val = val.substring(1);
    }
    val = val.substring(0, 10);

    let formatted = '+7 (';
    if (val.length > 0) formatted += val.substring(0, 3);
    if (val.length >= 3) formatted += `) ${val.substring(3, 6)}`;
    if (val.length >= 6) formatted += `-${val.substring(6, 8)}`;
    if (val.length >= 8) formatted += `-${val.substring(8, 10)}`;

    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitError('');
    if (import.meta.env.STATIC_HOSTING) {
      setSubmitError('Онлайн-отправка пока недоступна. Ваши данные не отправлены и остались в форме.');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        name,
        phone,
        repairType,
        area: area ? Number(area) : undefined,
        message,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Заявка не отправлена');
      const data = await res.json();

      if (data.success) {
        setSubmittedLead({
          leadNumber: data.leadNumber,
          message: data.message,
        });
        setName('');
        setPhone('');
        setMessage('');
        if (onClearInitialData) onClearInitialData();
      }
    } catch (err) {
      console.error('Error submitting lead:', err);
      setSubmitError('Не удалось отправить заявку. Данные остались в форме — попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#F5F6F7] py-20 md:py-28" id="contacts">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="font-inter font-bold text-xs uppercase tracking-widest text-[#0369a1] block mb-3">
            ОБРАТНАЯ СВЯЗЬ
          </span>
          <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-[#181f21] mb-4">
            Оставить заявку на ремонт
          </h2>
          <p className="font-inter text-base text-[#434749]">
            Получите расчет сметы и консультацию инженера в течение 24 часов
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 sm:p-10 rounded-lg border border-[#E2E8F0] shadow-md relative"
        >
          <div className="flex flex-col gap-2">
            <label className="font-inter font-bold text-xs text-[#434749] uppercase tracking-wider">
              Имя *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full p-4 rounded border border-[#c3c7c8] bg-[#f9f9f9] focus:bg-white focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all text-sm text-[#181f21]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter font-bold text-xs text-[#434749] uppercase tracking-wider">
              Телефон *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (___) ___-__-__"
              className="w-full p-4 rounded border border-[#c3c7c8] bg-[#f9f9f9] focus:bg-white focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all text-sm text-[#181f21]"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-inter font-bold text-xs text-[#434749] uppercase tracking-wider">
              Тип ремонта
            </label>
            <select
              value={repairType}
              onChange={(e) => setRepairType(e.target.value)}
              className="w-full p-4 rounded border border-[#c3c7c8] bg-[#f9f9f9] focus:bg-white focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all text-sm text-[#181f21] cursor-pointer"
            >
              <option value="Косметический">Косметический (от 12 000 ₽/м²)</option>
              <option value="Капитальный">Капитальный / Стандарт (от 22 000 ₽/м²)</option>
              <option value="Дизайнерский">Дизайнерский Премиум (от 35 000 ₽/м²)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-inter font-bold text-xs text-[#434749] uppercase tracking-wider">
              Площадь (м²)
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Пример: 75"
              className="w-full p-4 rounded border border-[#c3c7c8] bg-[#f9f9f9] focus:bg-white focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all text-sm text-[#181f21]"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-inter font-bold text-xs text-[#434749] uppercase tracking-wider">
              Сообщение
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Кратко о вашем проекте (ЖК, высота потолков, желаемые сроки)"
              className="w-full p-4 rounded border border-[#c3c7c8] bg-[#f9f9f9] focus:bg-white focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all text-sm text-[#181f21] resize-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col items-center gap-3 mt-2">
            {submitError && <p role="alert" className="text-sm text-amber-800 bg-amber-50 p-3 rounded">{submitError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0284c7] text-white font-montserrat font-bold text-sm uppercase h-[56px] px-12 rounded hover:bg-[#0369a1] transition-all duration-200 active:scale-95 shadow-md cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              id="submit-lead-btn"
            >
              {loading ? 'Отправка...' : 'ПОЛУЧИТЬ РАСЧЕТ'}
            </button>

            <p className="text-[11px] text-[#747879] text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Нажимая кнопку, вы даете согласие на обработку персональных данных
            </p>
          </div>
        </form>

        {submittedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-lg max-w-md w-full p-8 text-center relative shadow-2xl border border-[#E2E8F0]">
              <button
                onClick={() => setSubmittedLead(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="bg-[#e0f2fe] text-[#0369a1] font-montserrat font-bold text-xs uppercase px-3 py-1 rounded-full inline-block mb-3">
                Заявка #{submittedLead.leadNumber}
              </span>

              <h3 className="font-montserrat font-bold text-2xl text-[#181f21] mb-2">
                Заявка принята!
              </h3>

              <p className="font-inter text-sm text-[#434749] mb-6 leading-relaxed">
                {submittedLead.message}
              </p>

              <button
                onClick={() => setSubmittedLead(null)}
                className="w-full bg-[#181f21] hover:bg-[#2d3436] text-white font-montserrat font-bold text-xs uppercase py-3.5 rounded transition-colors cursor-pointer"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
