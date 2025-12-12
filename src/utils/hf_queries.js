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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API call failed:", error);
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API call failed:", error);
        // Fallback oder Error handling
        throw error;
    }
}
