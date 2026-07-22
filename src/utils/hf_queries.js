export async function queryHuggingFaceTextGeneration(data) {
    try {
        const response = await fetch("/.netlify/functions/hf_text_generation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status} - ${response.statusText}`,
            );
        }

        const result = await response.json();
        console.log("[hf_queries] Text generation result:", result);
        return result.generated_text;
    } catch (error) {
        console.error("[hf_queries] API call failed:", error);
        // Fallback oder Error handling
        throw error;
    }
}

export async function queryHuggingFaceChatCompletion(data) {
    try {
        const response = await fetch("/.netlify/functions/hf_chat_completion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("[hf_queries] Chat completion result:", result);
        return result.output_text;
    } catch (error) {
        console.error("[hf_queries] API call failed:", JSON.stringify(error));
        // Fallback oder Error handling
        throw error;
    }
}

export async function queryHuggingFaceTokenClassification(data) {
    try {
        const response = await fetch(
            "/.netlify/functions/hf_token_classification",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status} - ${response.statusText}`,
            );
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("[hf_queries] API call failed:", JSON.stringify(error));
        // Fallback oder Error handling
        throw error;
    }
}

// Map of available generators
export const textGenerators = {
    textGeneration: queryHuggingFaceTextGeneration,
    chatCompletion: queryHuggingFaceChatCompletion,
    // Add more as needed
};
