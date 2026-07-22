// import { OpenRouter } from "@openrouter/sdk";
// exports.handler = async (event, context) => {
//     // CORS headers
//     const headers = {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//     };

//     // Handle preflight requests
//     if (event.httpMethod === "OPTIONS") {
//         return { statusCode: 200, headers };
//     }

//     if (event.httpMethod !== "POST") {
//         return {
//             statusCode: 405,
//             headers,
//             body: JSON.stringify({ error: "Method Not Allowed" }),
//         };
//     }

//     try {
//         const openrouter = new OpenRouter({
//             apiKey: process.env.OPENROUTER_API_KEY,
//         });
//         const chatRequest = JSON.parse(event.body);
//         console.log(
//             "\n[HF_CHAT_COMPLETION] Received request data:\n",
//             chatRequest,
//         );

//         // Stream the response to get reasoning tokens in usage
//         const output = await openrouter.chat.send({
//             chatRequest: chatRequest,
//         });

//         console.log(
//             "\n[HF_CHAT_COMPLETION] Final response:\n",
//             output.choices[0],
//         );

//         return {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(output),
//         };
//     } catch (error) {
//         console.error("\n[HF_CHAT_COMPLETION] Function error:\n", error);
//         console.log(
//             "\n[HF_CHAT_COMPLETION] Error details:\n",
//             JSON.stringify(error),
//         );
//         return {
//             statusCode: 500,
//             headers,
//             body: JSON.stringify({
//                 error: "Internal Server Error",
//                 message: error,
//             }),
//         };
//     }
// };

import { GoogleGenAI } from "@google/genai";
exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    // Handle preflight requests
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_GENAI_API_KEY,
        });
        const chatRequest = JSON.parse(event.body);

        console.log(
            "\n[HF_CHAT_COMPLETION] Received request data:\n",
            chatRequest,
        );

        const interaction = await ai.interactions.create(chatRequest);

        console.log("\n[HF_CHAT_COMPLETION] Output:\n", interaction);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(interaction),
        };
    } catch (error) {
        console.error("\n[HF_CHAT_COMPLETION] Function error:\n", error);
        console.log(
            "\n[HF_CHAT_COMPLETION] Error details:\n",
            JSON.stringify(error),
        );
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal Server Error",
                message: error,
            }),
        };
    }
};
