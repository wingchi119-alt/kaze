
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, ChatMessage, Song, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getSystemInstruction = (songContext?: Song) => {
  const base = `你是一位專業的日文老師，專長於解釋「母語者的自然用法」。
你的職責是回答任何關於日文的疑問（單字、文法、句子、發音、文化、學習方法、JLPT 策略）。

回答的核心原則：
1. **母語者的自然用法**：務必說明「在日本一般人在這種情況下會怎麼說？」，解釋語感、口語與書面語的差異。
2. **詞彙詳解**：
   - 定義與詞性。
   - 標準重音：請使用標號標示（如 [0], [1], [2]）並說明高低音。
   - 豐富例句：提供至少 2-3 個情境實用例句（包含假名、漢字及中文翻譯）。
   - 常用搭配 (Collocations)：列出常搭配的助詞、形容詞或動詞。
   - 使用語境 (Nuance)：詳細說明場合、對象、語氣或隱含意義。
   - 相關詞彙：提供近義、反義詞並比較細微差別。

3. **回答風格**：溫柔且富有耐心，如同藤井風的音樂一樣溫暖。請務必使用繁體中文回答。`;

  if (songContext) {
    return `${base}\n\n當前學習情境：使用者正在學習藤井風的歌曲《${songContext.title}》(${songContext.romajiTitle})。
請盡可能結合這首歌的歌詞內容或背後的哲學（如：Help Ever, Hurt Never）來進行解答。
歌詞參考：\n${songContext.lyrics}`;
  }

  return base;
};

export const analyzeLyrics = async (lyrics: string, title: string): Promise<AnalysisResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `請分析藤井風歌曲《${title}》的歌詞，為日文初學者提取重點。
    1. 提取 4-6 個關鍵單字。
    2. 提取 2-3 個基礎文法點。
    3. 提供一段關於歌曲意境的中文摘要。
    4. 提供一個文化或語境提示。
    
    歌詞內容：
    ${lyrics}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                reading: { type: Type.STRING },
                meaning: { type: Type.STRING },
                context: { type: Type.STRING, description: "在歌中的意思或用法" }
              },
              required: ["word", "reading", "meaning", "context"]
            }
          },
          grammar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                explanation: { type: Type.STRING, description: "用繁體中文解釋" },
                example: { type: Type.STRING }
              },
              required: ["point", "explanation", "example"]
            }
          },
          culturalNote: { type: Type.STRING, description: "文化或背景補充（繁體中文）" },
          summary: { type: Type.STRING, description: "歌曲哲學摘要（繁體中文）" }
        },
        required: ["vocabulary", "grammar", "culturalNote", "summary"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AnalysisResponse;
};

export const generateQuiz = async (song: Song): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `請基於歌曲《${song.title}》的歌詞，設計 5 題適合日文初學者的選擇題。
    題目必須使用繁體中文。涵蓋單字意思、文法應用、發音或意境理解。
    歌詞：\n${song.lyrics}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING, description: "包含詳盡的教學解釋（繁體中文）" }
          },
          required: ["question", "options", "correctIndex", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as QuizQuestion[];
};

export const getQuickTranslation = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `請翻譯這段藤井風的歌詞並解釋其藝術語感（使用繁體中文）："${text}"`,
  });
  return response.text || "無法取得翻譯。";
};

export const askTutor = async (history: ChatMessage[], songContext?: Song): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    })),
    config: {
      systemInstruction: getSystemInstruction(songContext),
    }
  });
  return response.text || "抱歉，老師現在無法連線。";
};
