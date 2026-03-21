import OpenAI from 'openai';
import Groq from 'groq-sdk';

let openai = null;
let groq = null;

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

function getGroqClient() {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

const CATEGORIES = {
  calm: [
    "Take a deep breath. This moment will pass, and you'll both be stronger for it.",
    "In the silence, remember why you chose each other.",
    "Peace begins with a single breath.",
    "Sometimes the strongest love shows itself in our quietest moments."
  ],
  patience: [
    "Understanding comes to those who wait with open hearts.",
    "Love is patient, love is kind. It does not demand, it understands.",
    "The right words find their moment when we give them space.",
    "Every tension is an opportunity to choose love over being right."
  ],
  love: [
    "Even in disagreement, the love remains. That is what matters.",
    "You are partners, not opponents. Remember this in the storm.",
    "Love is not about winning. It's about understanding.",
    "The bond you share has weathered storms before. Trust it."
  ],
  understanding: [
    "Seek to understand before seeking to be understood.",
    "Behind every frustration is an unmet need waiting to be heard.",
    "What they need most is to feel heard, not fixed.",
    "Empathy is the bridge between two different worlds."
  ]
};

export async function generateQuote(category = 'calm') {
  const groqClient = getGroqClient();

  // Try Groq first (fastest, most generous free tier)
  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a wise, compassionate relationship counselor. Generate a single, brief (under 30 words), calming quote for a couple who is in a disagreement and needs to cool down. Focus on themes of: calm, patience, love, understanding. Be genuine, not cheesy. Do not use emojis or quotation marks in your response.`
          },
          {
            role: "user",
            content: `Give me a calming quote about ${category} for a couple having a difficult moment.`
          }
        ],
        max_tokens: 60,
        temperature: 0.8
      });

      const quote = completion.choices[0].message.content.trim();
      return { text: quote, source: 'ai', category };
    } catch (error) {
      console.error('Groq quote generation failed:', error.message);
    }
  }

  // Try OpenAI as fallback
  const client = getOpenAIClient();
  if (client) {
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a wise, compassionate relationship counselor. Generate a single, brief (under 30 words), calming quote for a couple who is in a disagreement and needs to cool down. Focus on themes of: calm, patience, love, understanding. Be genuine, not cheesy. Do not use emojis or quotation marks in your response.`
          },
          {
            role: "user",
            content: `Give me a calming quote about ${category} for a couple having a difficult moment.`
          }
        ],
        max_tokens: 60,
        temperature: 0.8
      });

      const quote = completion.choices[0].message.content.trim();
      return { text: quote, source: 'ai', category };
    } catch (error) {
      console.error('OpenAI quote generation failed:', error.message);
    }
  }

  // Fallback to curated quotes
  const quotes = CATEGORIES[category] || CATEGORIES.calm;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return { text: randomQuote, source: 'curated', category };
}
