import OpenAI from "openai";

let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function getAIHelp(question: string, context?: string) {
  if (!openai) {
    throw new Error("OpenAI not initialized - OPENAI_API_KEY not found");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for ChezMoi, a culinary platform connecting chefs with customers. Provide helpful, friendly responses about cooking, chef services, and platform features. Always respond in the same language as the user's question."
        },
        {
          role: "user",
          content: context ? `Context: ${context}\n\nQuestion: ${question}` : question
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error getting AI help:", error);
    throw error;
  }
}

export async function generateContextualHelp(userProfile: any, currentPage: string) {
  if (!openai) {
    return "AI assistant is not available at the moment.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Generate helpful, contextual assistance for ChezMoi users based on their current page and profile. Keep responses concise and actionable."
        },
        {
          role: "user",
          content: `User is on page: ${currentPage}. User profile: ${JSON.stringify(userProfile)}. Provide contextual help.`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "Welcome to ChezMoi! How can I help you today?";
  } catch (error) {
    console.error("Error generating contextual help:", error);
    return "Welcome to ChezMoi! How can I help you today?";
  }
}
