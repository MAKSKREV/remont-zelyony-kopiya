import React, { useState, useRef, useEffect } from 'react';
import { AIChatMessage } from '../types';
import { Send, X, Bot, User, Loader2, MessageCircle, ChevronDown } from 'lucide-react';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestMeasurement: () => void;
}

const SYSTEM_PROMPT = `Ты — Алексей, менеджер компании РемонтПросто, specializing in проектирование и ремонт квартир в Москве и МО. Ты вежливый, опытный профессионал, который помогает клиентам с выбором типа ремонта, расчетом сметы, подбором материалов и отвечает на вопросы по строительным технологиям.

Основные правила:
- Отвечай на русском языке
- Будь дружелюбным, но профессиональным
- Давай конкретные, полезные советы по ремонту
- Если клиент спрашивает цену — ориентировочно называй диапазоны: косметический от 12 000 ₽/м², капитальный от 22 000 ₽/м², дизайнерский от 35 000 ₽/м²
- Рекомендуй записаться на бесплатный замер инженером
- Не придумывай информацию, которой не уверен
- Если вопрос не по теме ремонта — вежливо верни разговор к ремонтной тематике
- В конце каждого ответа (кроме приветствия) мягко предлагай записаться на замер или задать ещё вопрос
- Используй эмодзи умеренно, не злоупотребляй
- Пиши КОРОТКО — максимум 2-3 предложения на ответ. Без длинных абзацев и перечислений
- Ты представляешь компанию РемонтПросто`;

const QUICK_PROMPTS = [
  'Сколько стоит ремонт квартиры 60 м²?',
  'Какой тип ремонта выбрать?',
  'Сколько длится ремонт?',
  'Какие материалы вы используете?',
];

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
  onRequestMeasurement,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Здравствуйте! 👋 Я Алексей, менеджер компании РемонтПросто.\n\nПомогу вам с:\n• Расчетом стоимости ремонта\n• Выбором типа отделки\n• Подбором материалов\n• Ответами на вопросы по технологиям\n\nЧем могу помочь?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || inputQuestion).trim();
    if (!question || loading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuestion('');
    setLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.text,
        })),
        { role: 'user' as const, content: question },
      ];

      const res = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      console.log('AI response:', data);

      let answer = '';
      if (data.answer) {
        answer = data.answer;
      } else {
        answer = 'Получен пустой ответ от ИИ. Попробуйте переформулировать вопрос.';
        console.warn('Unexpected response:', data);
      }

      const assistantMsg: AIChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Network error querying AI consultant:', err?.message || err);
      const fallbackMsg: AIChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: `Сеть недоступна (${err?.message || 'неизвестная ошибка'}). Попробуйте ещё раз или оставьте заявку на сайте.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4 animate-fadeIn">
      <div className="fixed inset-0 bg-black/40 sm:bg-black/60 sm:backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:w-[420px] h-full sm:h-[680px] sm:max-h-[85vh] bg-white sm:rounded-2xl flex flex-col shadow-2xl sm:border border-[#E2E8F0] overflow-hidden z-10 sm:mr-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#181f21] to-[#1a1c1c] p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center text-white shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-[#181f21]" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-sm sm:text-base text-white">
                РемонтПросто
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[11px] text-[#959c9f] font-inter">Онлайн — отвечает за 30 сек</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#f9f9f9]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[92%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-[#181f21] to-[#2d3436] text-white rounded-br-md'
                      : 'bg-white border border-[#E2E8F0] text-[#1a1c1c] shadow-sm rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>

                <div className={`flex items-center gap-1.5 mt-1 px-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  <span className="text-[10px] text-[#a0a4a5]">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 mr-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#0284c7] animate-spin" />
                  <span className="text-xs text-[#747879] font-inter">Алексей печатает...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2.5 bg-white border-t border-[#E2E8F0] overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="whitespace-nowrap text-[11px] font-inter font-medium bg-[#f3f3f4] hover:bg-[#e0f2fe] text-[#434749] hover:text-[#0284c7] px-3 py-1.5 rounded-full border border-[#E2E8F0] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E2E8F0] shrink-0">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Напишите сообщение..."
              className="flex-1 bg-[#f3f3f4] rounded-xl px-4 py-3 text-sm text-[#181f21] outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:bg-white transition-all font-inter placeholder:text-[#a0a4a5]"
              disabled={loading}
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputQuestion.trim() || loading}
              className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#024880] disabled:from-[#c3c7c8] disabled:to-[#c3c7c8] text-white w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f3f3f4] px-4 py-2 flex items-center justify-between text-[11px] text-[#747879] border-t border-[#E2E8F0] shrink-0">
          <span className="font-inter">Нужна консультация на объекте?</span>
          <button
            onClick={() => {
              onClose();
              onRequestMeasurement();
            }}
            className="text-[#0284c7] font-montserrat font-bold hover:underline cursor-pointer"
          >
            Заказать замер
          </button>
        </div>
      </div>
    </div>
  );
};
