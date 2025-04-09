import { generateText } from "ai";
import { getBotById } from "@/lib/bots";
import { openai } from "@ai-sdk/openai";
import { queryPinecone } from "@/lib/pinecone";

/**
 * @description Helper function to generate a properly formatted bad request error response
 * @param errorMess - The error message to include in the response
 * @returns A Response object with a 400 status code and JSON content
 */
function generateBadRequestError(errorMess: string) {
  return new Response(JSON.stringify({ error: errorMess }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * @description Helper function to generate a properly formatted internal server error response
 * @param error - The error object that was caught
 * @param userMess - A user-friendly message to include in the response
 * @returns A Response object with a 500 status code and JSON content
 */
function generateIntervalServerError(error: any, userMess: string) {
  return new Response(
    JSON.stringify({
      error: userMess,
      text: `Error: ${error.message || "Unknown error"}`,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * @description POST handler for the chat API endpoint
 Processes chat messages, retrieves context from Pinecone, and generates AI responses
 */
export async function POST(req: Request) {
  try {
    const { messages, botId } = await req.json();

    // Get last message user sent
    const lastUserMessage = messages
      .filter((m: any) => m.role === "user")
      .pop();
    if (!lastUserMessage) {
      return generateBadRequestError("No user message found");
    }

    // Get bot
    const bot = getBotById(botId || "empire");
    if (!bot) {
      return generateBadRequestError("Invalid bot");
    }

    // Try to query Pinecone for relevant context
    let context = "No specific information available for this query.";
    try {
      const pineconeResults = await queryPinecone(
        lastUserMessage.content,
        bot.namespace
      );

      // console.log("Namespace:", bot.namespace, "result is:", pineconeResults);

      // Extract context from Pinecone results
      if (pineconeResults && pineconeResults.length > 0) {
        context = pineconeResults
          .map((match) => match.metadata?.text || "")
          .filter(Boolean)
          .join("\n\n");
      }
    } catch (pineconeError) {
      console.error("Pinecone query error:", pineconeError);
    }

    // Create a system message with the bot's configuration and retrieved context
    const systemMessage = {
      role: "system",
      content: `
        Your name is ${bot.name}
        ${bot.systemPrompt}
        
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK

        Format your responses using Markdown syntax for better readability:
        - Use **bold** for emphasis
        - Use *italic* for subtle emphasis
        - Use \`code\` for technical terms or code snippets
        - Use \`\`\`language
          code block
          \`\`\` for multi-line code examples
        - Use bullet points and numbered lists where appropriate
        - Use headings (## and ###) to organize longer responses
      `,
    };

    // Format messages properly for OpenAI
    const formattedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const augmentedMessages = [systemMessage, ...formattedMessages];

    try {
      // Generate a response using the AI SDK
      const { text } = await generateText({
        model: openai(process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini"),
        messages: augmentedMessages,
      });

      // Return the generated text as JSON
      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      return generateIntervalServerError(error, "Error generating response");
    }
  } catch (error: any) {
    console.error("General error in chat route:", error);
    return generateIntervalServerError(error, "Error processing your request");
  }
}
