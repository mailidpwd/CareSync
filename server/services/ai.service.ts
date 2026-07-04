import { GoogleGenAI } from '@google/genai';
import { AIHealthTip } from '../../src/types';

const getAIClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('[CareSync AI] GEMINI_API_KEY is not configured. Falling back to offline tips.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const FALLBACK_TIPS: AIHealthTip[] = [
  {
    id: 'tip-1',
    category: 'medication',
    title: 'Establish a Routine',
    content: 'Taking your medicine at the exact same times every day can trigger habits. Try linking them to daily actions like brushing your teeth or eating breakfast.',
    actionable: 'Set a repeating alarm on your phone aligned with your dental routine.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-2',
    category: 'hydration',
    title: 'Consistent Water Intake',
    content: 'Dehydration can often mimic tiredness or hunger. Keeping a water bottle by your desk ensures you drink constantly.',
    actionable: 'Take a sip of water every time you check your email or messages.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-3',
    category: 'sleep',
    title: 'Wind Down Early',
    content: 'Blue light from your phone disrupts melatonin production. Shutting off electronic screens 1 hour before bed enhances sleep quality.',
    actionable: 'Read a physical book or try light stretching instead of scrolling before sleep.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-4',
    category: 'lifestyle',
    title: 'Take Micro-Workouts',
    content: 'Even small bursts of activity throughout the day, like a 5-minute walk, can significantly improve your cardiovascular health and mood.',
    actionable: 'Stand up and stretch for 2 minutes for every hour of sitting.',
    createdAt: new Date().toISOString()
  }
];

export class AIService {
  static async generateHealthTips(userContext: string): Promise<AIHealthTip[]> {
    const ai = getAIClient();
    if (!ai) {
      return FALLBACK_TIPS;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are CareSync's medical AI health coach helper. Generates 3 personalized, highly actionable health and medication adherence tips.
                Respond strictly in JSON format. Do not wrap the JSON in markdown code blocks like \`\`\`json. Return a raw JSON array matching this TypeScript type:
                Array<{
                  category: 'medication' | 'lifestyle' | 'sleep' | 'hydration' | 'general';
                  title: string;
                  content: string;
                  actionable: string;
                }>

                User context: ${userContext}`
              }
            ]
          }
        ]
      });

      const responseText = response.text || '';
      // Clean possible JSON tags
      const cleanedText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanedText);

      return parsed.map((item: any, idx: number) => ({
        id: `ai-tip-${idx + 1}-${Date.now()}`,
        category: item.category || 'general',
        title: item.title || 'Health Tip',
        content: item.content || '',
        actionable: item.actionable || '',
        createdAt: new Date().toISOString()
      }));

    } catch (error) {
      console.error('[CareSync AI Error]', error);
      return FALLBACK_TIPS;
    }
  }

  static async explainMedication(medName: string, dosage: string, notes: string): Promise<string> {
    const ai = getAIClient();
    if (!ai) {
      return `Detailed explanation for ${medName} (${dosage}): This medication should be taken exactly as prescribed by your physician. Ensure you read the directions carefully, note any food interactions (${notes || 'none provided'}), and maintain consistent hydration.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Provide a friendly, medical-coach explanation for the medication "${medName}" with dosage "${dosage}". 
                Explain what it's typically used for, key safety suggestions, possible common symptoms, and how to manage the routine. Keep the explanation under 200 words. 
                Notes: ${notes || 'none'}`
              }
            ]
          }
        ]
      });

      return response.text || 'No explanation generated.';
    } catch (e) {
      return `Could not generate AI explanation for ${medName}. Please check your prescription directions or ask your doctor.`;
    }
  }
}
