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
        console.log(
            "\n[HF_TEXT_GENERATION] Received request data:\n",
            requestData,
        );

        const output = await client.textGeneration(requestData);
        console.log(
            "\n[HF_TEXT_GENERATION] Text generation output:\n",
            JSON.stringify(output),
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(output),
        };
    } catch (error) {
        console.error(
            "\n[HF_TEXT_GENERATION] Function error:\n",
            error,
            "\n[HF_TEXT_GENERATION] Error details:\n",
            JSON.stringify(error),
        );
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal Server Error",
                message: error.httpResponse.body.error.message,
            }),
        };
    }
};
