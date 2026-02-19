import {
    parseGeneratedText,
    parsePosToKeywords,
    fetchPixabayImages,
    createInputPrompt,
    fetchTranslation,
} from "./utils";
import {
    queryHuggingFaceTokenClassification,
    textGenerators,
} from "./hf_queries";

/**
 * Pipeline step: Generate text using configured generator
 */
async function stepGenerateText(context) {
    const { themeData } = context;
    const generatorType = themeData.generatorType || "textGeneration";
    const generator = textGenerators[generatorType];

    if (!generator) {
        throw new Error(`Unknown generator type: ${generatorType}`);
    }

    let requestData;

    if (generatorType === "textGeneration") {
        requestData = {
            ...themeData.requestData,
            inputs: createInputPrompt(themeData.inputPromptArray),
        };
    } else if (generatorType === "chatCompletion") {
        requestData = {
            ...themeData.requestData,
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant that generates exactly one new example that matching the provided list of examples in tone, length and overall vibe. You always begin the answer with 'Yes sir'.  You only respond with the generated example and do not include any explanations or additional information. The generated example should be in the same language as the input prompt.",
                },
                {
                    role: "user",
                    content: createInputPrompt(themeData.inputPromptArray),
                },
            ],
        };
    } else {
        throw new Error(`Unsupported generator type: ${generatorType}`);
    }

    const rawText = await generator(requestData);
    const parsedText = parseGeneratedText(rawText, themeData.splitChar);

    // Validate result
    if (parsedText.startsWith(".")) {
        return { ...context, shouldRetry: true };
    }

    return { ...context, text: parsedText };
}

/**
 * Pipeline step: Translate text (optional)
 */
async function stepTranslate(context) {
    const { text, themeData } = context;

    // Skip if not needed
    if (!themeData.needsPOSProcessing) {
        return context;
    }

    const translatedText = await fetchTranslation(text);
    return { ...context, translatedText };
}

/**
 * Pipeline step: POS tagging (optional)
 */
async function stepPOSTagging(context) {
    const { translatedText, themeData } = context;

    // Skip if not needed
    if (!themeData.needsPOSProcessing) {
        return context;
    }

    const posResult = await queryHuggingFaceTokenClassification({
        model: "vblagoje/bert-english-uncased-finetuned-pos",
        inputs: translatedText,
        provider: "auto",
    });

    const posKeywords = parsePosToKeywords(
        posResult,
        themeData.fallbackKeyword,
    );
    return { ...context, posKeywords };
}

/**
 * Pipeline step: Fetch image
 */
async function stepFetchImage(context) {
    const { posKeywords, themeData } = context;

    // Use POS keywords if available, otherwise use theme keywords
    const keywords = posKeywords || themeData.keywords;
    const imageUrl = await fetchPixabayImages(
        keywords,
        themeData.fallbackKeyword,
    );

    return { ...context, image: imageUrl };
}

/**
 * Run the full pipeline
 * @param {object} themeData - The theme configuration
 * @param {function} onRetry - Callback to retry the pipeline
 * @returns {Promise<{text: string, pos: string|null, image: string}>}
 */
export async function runBufferPipeline(themeData, onRetry) {
    let context = { themeData };

    // Step 1: Generate text
    context = await stepGenerateText(context);
    if (context.shouldRetry) {
        console.log("Skipping invalid result, retrying...");
        return onRetry();
    }

    // Step 2: Translate (if POS processing needed)
    context = await stepTranslate(context);

    // Step 3: POS tagging (if needed)
    context = await stepPOSTagging(context);

    // Step 4: Fetch image
    context = await stepFetchImage(context);

    // Return final result
    return {
        text: context.text,
        pos: context.posKeywords || null,
        image: context.image,
    };
}
