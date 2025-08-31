import OpenAI from 'openai';
import supabase from '../config/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class MoodAnalysisService {
  async analyzeEmotion(message: string) {
    try {
      const completion: any = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: 'Classify the emotion as happy, sad, angry, disgust, fear, surprise, or neutral. Return JSON: {emotion: string, confidence: number, reasoning: string}' },
          { role: 'user', content: message }
        ],
        temperature: 0.3
      });

      const text = completion.choices?.[0]?.message?.content;
      if (!text) return { emotion: 'neutral', confidence: 0.5, reasoning: 'no response' };

      try {
        return JSON.parse(text);
      } catch (err) {
        // fallback: try to extract JSON object from text
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        return { emotion: 'neutral', confidence: 0.5, reasoning: text };
      }
    } catch (err) {
      return { emotion: 'neutral', confidence: 0.0, reasoning: 'model error' };
    }
  }

  async generateResponse(emotion: string, message: string) {
    try {
      const completion: any = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: 'As an empathetic therapist, provide an empathetic 2-3 sentence response, a short motivational quote, and one practical suggestion in JSON format: {aiResponse: string, motivationalQuote: string, suggestion: string, backgroundTheme: string}' },
          { role: 'user', content: `User feels ${emotion}: "${message}"` }
        ],
        temperature: 0.6
      });

      const text = completion.choices?.[0]?.message?.content;
      if (!text) return { aiResponse: '', motivationalQuote: '', suggestion: '', backgroundTheme: '' };

      try {
        return JSON.parse(text);
      } catch (err) {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        return { aiResponse: text, motivationalQuote: '', suggestion: '', backgroundTheme: 'neutral' };
      }
    } catch (err) {
      return { aiResponse: '', motivationalQuote: '', suggestion: '', backgroundTheme: 'neutral' };
    }
  }

  async saveMoodEntry(userId: string, data: any) {
    const payload = {
      user_id: userId,
      session_id: data.sessionId,
      message: data.message,
      input_type: data.inputType || 'text',
      detected_mood: data.emotion,
      mood_confidence: data.confidence,
      ai_response: data.aiResponse,
      motivational_quote: data.motivationalQuote,
      background_theme: data.backgroundTheme,
      metadata: data.metadata || {}
    } as any;

    const { data: entry, error } = await supabase.from('mood_entries').insert(payload).select().single();
    if (error) throw error;
    return entry;
  }
}

export default new MoodAnalysisService();
