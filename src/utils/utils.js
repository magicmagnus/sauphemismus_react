export function parseGeneratedText(result, splitChar) {
    result = result.replace("\\n", "*");
    result = result.replace(/^\s+/, "");
    result = result.split(splitChar)[0];
    return result;
}

export function parsePosToKeywords(pos, fallbackKeyword = "beer") {
    var POScollection = {};

    // collect the entries per entity_group
    for (var i = 0; i < pos.length; i++) {
        POScollection[pos[i].entity_group] = "";
    }
    for (var i = 0; i < pos.length; i++) {
        if (!pos[i].word.includes("##")) {
            POScollection[pos[i].entity_group] += pos[i].word + "+";
        }
    }

    let keywords = "";
    const order = ["NOUN", "PROPN", "ADJ", "ADV", "VERB", "ADP"];

    for (const key of order) {
        if (key in POScollection && POScollection[key]) {
            keywords += POScollection[key];
        }
    }

    // remove any trailing pluses added while building the POS entries
    keywords = keywords.replace(/\++$/, "");

    //limit to 100 characters
    keywords = keywords.substring(0, 100);

    if (keywords == "") {
        console.log(
            "No POS keywords found, using fallback keyword:",
            fallbackKeyword,
        );
        keywords = fallbackKeyword;
    }
    return keywords;
}

export function parsePixabayImages(data) {
    if (!data || !data.hits || data.hits.length === 0) {
        console.error("Invalid Pixabay API response");
        return null;
    }
    const randomIndex = Math.floor(Math.random() * data.hits.length);

    return data.hits[randomIndex].largeImageURL;
}

export async function fetchPixabayImages(keywords, fallbackKeyword = "beer") {
    // if keywords an array, join random one with fallbackKeyword
    if (Array.isArray(keywords)) {
        keywords.sort(() => Math.random() - 0.5);
        keywords = keywords[0] + "+" + fallbackKeyword;
    }
    console.log("Fetching Pixabay images for keywords:", keywords);
    const response = await fetch(
        `https://pixabay.com/api/?key=44651696-fb16f33f4e495b9a42868696c&safesearch=true&q=${keywords}&orientation=all&image_type=photo&per_page=50`,
    );
    const image_url = parsePixabayImages(await response.json());
    if (image_url == null) {
        console.log(
            "Pixabay API: No image found for keywords:",
            keywords,
            "using fallback:",
            fallbackKeyword,
        );
        return fetchPixabayImages(fallbackKeyword);
    }
    return image_url;
}

export function createInputPrompt(inputPromptArray) {
    var inputPrompt = "";
    // shuffle the inputPromptArray all the time

    inputPromptArray.sort(() => Math.random() - 0.5);
    for (var i = 0; i < inputPromptArray.length; i++) {
        inputPrompt += inputPromptArray[i] + "*";
    }
    console.log("Created input prompt:", inputPrompt);

    return inputPrompt;
}

export async function fetchTranslation(text) {
    try {
        const encodedText = encodeURIComponent(text);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=de|en&de=name@domain.de`;

        const response = await fetch(url);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Translation error:", error);
        return text; // Fallback to original text if translation fails
    }
}
