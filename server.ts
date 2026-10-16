import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const leadSubmissions: Array<{
    id: string;
    name: string;
    phone: string;
    repairType: string;
    area?: number;
    message?: string;
    createdAt: string;
  }> = [];

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/leads", (req, res) => {
    const { name, phone, repairType, area, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Имя и телефон обязательны для заполнения" });
    }

    const newLead = {
      id: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      repairType: String(repairType || "Капитальный"),
      area: area ? Number(area) : undefined,
      message: message ? String(message).trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    leadSubmissions.unshift(newLead);

    return res.json({
      success: true,
      leadNumber: newLead.id,
      message: "Заявка успешно зарегистрирована. Наш главный инженер свяжется с вами в течение 15 минут.",
    });
  });

  app.get("/api/leads", (_req, res) => {
    res.json({ leads: leadSubmissions });
  });

  app.post("/api/openai-chat", async (req, res) => {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "messages required" });
    }

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const question = lastUserMsg?.content || '';

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    // Try OpenCode Zen first
    if (openRouterKey) {
      try {
        const response = await fetch("https://opencode.ai/zen/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openRouterKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-v4-flash-free",
            messages,
            max_tokens: 512,
            temperature: 0.7,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Zen OK, model:", data.model);
          if (data.choices && data.choices[0]?.message?.content) {
            return res.json({ answer: data.choices[0].message.content });
          }
        } else {
          const errData = await response.text();
          console.log("Zen failed:", response.status, errData.slice(0, 300));
        }
      } catch (err: any) {
        console.log("Zen network error:", err?.code || err?.message);
      }
    }

    // Fallback to Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== "MY_GEMINI_API_KEY") {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const systemMsg = messages.find(m => m.role === 'system')?.content || '';
        const chatHistory = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n\n');
        const prompt = `${systemMsg}\n\nВопрос: "${chatHistory}"\n\nКороткий ответ (2-3 предложения).`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          return res.json({ answer: response.text });
        }
      } catch (err: any) {
        console.log("Gemini fallback error:", err?.message);
      }
    }

    // Ultimate fallback — hardcoded answers
    return res.json({ answer: getFallbackAnswer(question) });
  });

  app.post("/api/ai-consultant", async (req, res) => {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Вопрос не может быть пустым" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        answer: getFallbackAnswer(question),
        source: "РемонтПросто Knowledge Base (Offline mode)",
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Ты — главный инженер-технолог и эксперт по ремонту квартир компании РемонтПросто в Москве.
Компания РемонтПросто занимается комплексным ремонтом под ключ (проектирование, черновой ремонт, чистовая отделка, приемка).
Твоя задача — профессионально, точно, вежливо и понятно отвечать клиентам на вопросы о ремонте, стройматериалах, этапах, сметных расчетах, выборе планировок и технологий.

Контекст запроса: ${context || "Клиент консультируется по ремонту квартиры"}
Вопрос пользователя: "${question}"

Правила ответа:
1. Отвечай на русском языке в инженерно-экспертном, вежливом и понятном стиле.
2. Приводи структурированные ответы (по шагам, списком или с четкими выводами).
3. Указывай реальные строительные стандарты (СНиП, ГОСТ, материалы Knauf, Rehau, Schneider, CERESIT, акклиматизация паркета, гидроизоляция сантехзоны и т.д.).
4. В конце ненавязчиво предложи бесплатный выезд инженера РемонтПросто для точного замера и составления сметы на объекте.
5. Не пиши слишком длинный текст (максимум 3-4 коротких абзаца или список из 4-5 пунктов).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "Извините, не удалось сформировать ответ. Попробуйте сформулировать вопрос иначе.";
      return res.json({ answer: text, source: "Gemini AI + РемонтПросто Knowledge Base" });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.json({
        answer: getFallbackAnswer(question),
        source: "РемонтПросто Knowledge Base (Fallback)",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`РемонтПросто Server listening on http://0.0.0.0:${PORT}`);
  });
}

function getFallbackAnswer(q: string): string {
  const query = q.toLowerCase();
  if (query.includes("стяжка") || query.includes("сохнет") || query.includes("пол")) {
    return "💡 **Время высыхания стяжки:**\n• Полусухая стяжка (пескобетон): ходьба возможна через 24 часа, укладка плитки через 7–10 дней, а ламината/паркета — через 21–28 дней.\n• Мокрая традиционная стяжка сохнет из расчета 1 неделя на 1 см толщины (при толщине 5 см — минимум 35 дней).\n\nНаши инженеры РемонтПросто контролируют влажность влагомером перед укладкой любого чистового покрытия.";
  }
  if (query.includes("шпаклевк") || query.includes("обои") || query.includes("покраск")) {
    return "🎨 **Отличие подготовки под обои и под покраску:**\n• **Под обои (Q2/Q3):** достаточно 2 слоев финишной шпаклевки и огрунтовки.\n• **Под покраску (Q4):** требуется проклейка стеклохолста ('паутинки') для защиты от микротрещин, суперфинишная шпаклевка (например, Danogips) и прожекторный контроль боковым светом.\n\nВ ремонте под ключ РемонтПросто строго соблюдает стандарт подготовленности поверхностей.";
  }
  if (query.includes("электрик") || query.includes("кабель") || query.includes("щит")) {
    return "⚡ **Стандарты электрики РемонтПросто:**\n• Используем только ГОСТ-кабель ВВГнг-LS (3х2.5 мм² на розетки, 3х1.5 мм² на освещение).\n• Устанавливаем УЗО / дифмалав автоматах на каждую мокрую зону (ванная, кухня) для полной безопасности.\n• Собственный сборный щит с маркой ABB или DEKraft с реле напряжения от скачков.";
  }
  if (query.includes("цена") || query.includes("стоимост") || query.includes("смет")) {
    return "📊 **Базовая стоимость работ в Москве:**\n• Косметический ремонт: от 12 000 ₽ / м²\n• Капитальный (черновой + чистовой): от 22 000 ₽ / м²\n• Дизайнерский под ключ: от 35 000 ₽ / м²\n\nТочная сумма фиксируется в договоре и не меняется во время ремонта!";
  }
  return "🏗️ **Совет эксперта РемонтПросто:**\nРемонт квартиры требует четкой последовательности: 1) Дизайн и инженерный проект → 2) Демонтаж и перегородки → 3) Черновая сантехника и электрика → 4) Штукатурка и стяжка → 5) Чистовая отделка → 6) Клининг и сдача.\n\nЗакажите бесплатный выезд инженера для детализированного замера и зафиксируйте скидку 5%!";
}

startServer();
