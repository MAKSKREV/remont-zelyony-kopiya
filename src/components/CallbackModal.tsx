import React, { useState } from 'react';
import { X, Phone, CheckCircle2 } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  title = 'Заказать обратный звонок',
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, repairType: 'Вызов инженера на замер' }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-lg max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-[#E2E8F0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-[#0284c7]/10 text-[#0284c7] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-montserrat font-bold text-2xl text-[#181f21] mb-2">
              Спасибо за заявку!
            </h3>
            <p className="font-inter text-sm text-[#434749] mb-6">
              Наш инженер свяжется с вами в течение 15 минут для уточнения удобного времени замера.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#181f21] text-white font-montserrat font-bold text-xs uppercase py-3.5 rounded"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-[#181f21]">
                {title}
              </h3>
            </div>

            <p className="font-inter text-xs text-[#434749] mb-6 leading-relaxed">
              Оставьте свои контакты. Замерщик приедет с лазерным оборудованием и образцами материалов.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-inter font-bold text-xs text-[#434749] uppercase block mb-1">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван"
                  className="w-full p-3.5 rounded border border-[#c3c7c8] bg-[#f9f9f9] focus:bg-white focus:border-[#0284c7] outline-none text-sm text-[#181f21]"
                />
              </div>

              <div>
                <label className="font-inter font-bold text-xs text-[#434749] uppercase block mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full p-3.5 rounded border border-[#c3c7c8] bg-[#f9f9f9] focus:bg-white focus:border-[#0284c7] outline-none text-sm text-[#181f21]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-montserrat font-bold text-xs uppercase py-4 rounded transition-colors cursor-pointer mt-2"
              >
                {loading ? 'Отправка...' : 'Перезвоните мне'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
