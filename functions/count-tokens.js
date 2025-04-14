// Import the Google AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// This is the entry point for the Cloudflare Function
// It receives the request and the environment variables (env)
export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // --- Configuration ---
    // Get the API key from Cloudflare environment variables
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY environment variable not set." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Choose the model (e.g., 'gemini-1.5-flash-latest')
    // Make sure the model you choose supports countTokens
    const MODEL_NAME = "gemini-1.5-flash-latest";
    // --- End Configuration ---


    // Initialize the Generative AI client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // --- Input Handling ---
    // Check if the request body is JSON
    if (request.headers.get("content-type") !== "application/json") {
      return new Response(
        JSON.stringify({ error: "Request body must be JSON." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body to get the text
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'text' field in request body." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // --- End Input Handling ---


    // --- Call Gemini API ---
    const { totalTokens } = await model.countTokens(text);
    // --- End Call Gemini API ---


    // --- Send Response ---
    // Return the token count as JSON
    return new Response(
      JSON.stringify({ tokenCount: totalTokens }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    // --- End Send Response ---

  } catch (error) {
    console.error("Error processing request:", error);
    // Return a generic error response
    return new Response(
      JSON.stringify({ error: "An internal server error occurred.", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Optional: Handle other methods like GET if needed, otherwise Cloudflare
// will return a 405 Method Not Allowed error automatically.
// export async function onRequestGet(context) {
//   return new Response("Please use POST method with JSON body: { \"text\": \"...\" }", { status: 405 });
// } 