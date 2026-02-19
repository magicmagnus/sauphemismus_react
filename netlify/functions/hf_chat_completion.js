import { InferenceClient } from "@huggingface/inference";
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
        const client = new InferenceClient(process.env.HUGGINGFACE_KEY);
        const requestData = JSON.parse(event.body);
        console.log("Received request data:", requestData);

        const output = await client.chatCompletion(requestData);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(output),
        };
    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal Server Error",
                message: error.message,
            }),
        };
    }
};
