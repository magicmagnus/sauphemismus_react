import { useState, useEffect, use } from "react";
import {
    queryHuggingFaceTextGeneration,
    queryHuggingFaceTokenClassification,
} from "./utils/hf_queries";
import {
    parseGeneratedText,
    parsePosToKeywords,
    fetchPixabayImages,
    createInputPrompt,
    fetchTranslation,
} from "./utils/utils";
import themedata from "./data/data.json";

function App() {
    const [currentTheme, setCurrentTheme] = useState({
        name: "sauphemismus",
        data: themedata.sauphemismus,
    });

    const [generatedTextMain, setGeneratedTextMain] = useState({
        text: null,
        pos: null,
        image: null,
    });
    const [generatedTextBuffer, setGeneratedTextBuffer] = useState({
        text: null,
        pos: null,
        image: null,
    });

    const [isMainLoading, setIsMainLoading] = useState(false);
    const [isBufferLoading, setIsBufferLoading] = useState(false);

    // on first load, start loading buffer
    // useEffect(() => {
    //     loadBuffer();
    // }, []);

    useEffect(() => {
        console.log("Current theme changed to:", currentTheme.name);
        loadBuffer();
    }, [currentTheme]);

    // when buffer finishes loading and main is (loading or empty), update main first, then start loading next buffer
    useEffect(() => {
        if (
            !isBufferLoading &&
            (isMainLoading || generatedTextMain.text == null) &&
            generatedTextBuffer.text != null
        ) {
            setGeneratedTextMain(generatedTextBuffer);
            setIsMainLoading(false);
            loadBuffer();
        }
    }, [
        isBufferLoading,
        isMainLoading,
        generatedTextMain,
        generatedTextBuffer,
    ]);

    const loadBuffer = () => {
        setIsBufferLoading(true);
        if (["sauphemismus", "pilzfinder"].includes(currentTheme.name)) {
            loadBufferWithoutPOS();
        } else {
            loadBufferWithPOS();
        }
    };

    const loadBufferWithPOS = () => {
        setIsBufferLoading(true);
        // step 1: first fetch the generated text (the main output)
        currentTheme.data.requestData.inputs = createInputPrompt(
            currentTheme.data.inputPromptArray,
        );
        queryHuggingFaceTextGeneration(currentTheme.data.requestData).then(
            (raw_result_text) => {
                var result_text = parseGeneratedText(
                    raw_result_text.generated_text,
                    currentTheme.data.splitChar,
                );
                //console.log("loadBuffer result:", result_text);

                if (result_text.startsWith(".")) {
                    console.log("Skipping invalid result, loading again.");
                    loadBuffer();
                    return;
                }
                // step 1.5:  translate result_text to english cause the POS model is english-only
                fetchTranslation(result_text).then((result_translation) => {
                    //console.log("Translation result:", result_translation);

                    // step 2:  fetch the POS (NOUN, VERB, etc.) for that (translated) text
                    queryHuggingFaceTokenClassification({
                        model: "vblagoje/bert-english-uncased-finetuned-pos",
                        inputs: result_translation,
                        provider: "auto",
                    }).then((raw_result_pos) => {
                        var result_pos = parsePosToKeywords(
                            raw_result_pos,
                            currentTheme.data.fallbackKeyword,
                        );
                        //console.log("POS result:", result_pos);
                        // step 3: finally fetch images from pixabay for the POS keywords
                        fetchPixabayImages(
                            result_pos,
                            currentTheme.data.fallbackKeyword,
                        ).then((image_url) => {
                            console.log("final buffer:", {
                                text: result_text,
                                pos: result_pos,
                                image: image_url,
                            });
                            setGeneratedTextBuffer({
                                text: result_text,
                                pos: result_pos,
                                image: image_url,
                            });
                            setIsBufferLoading(false);
                        });
                    });
                });
            },
        );
    };

    const loadBufferWithoutPOS = () => {
        setIsBufferLoading(true);
        // step 1: first fetch the generated text (the main output)
        currentTheme.data.requestData.inputs = createInputPrompt(
            currentTheme.data.inputPromptArray,
        );
        queryHuggingFaceTextGeneration(currentTheme.data.requestData).then(
            (raw_result_text) => {
                var result_text = parseGeneratedText(
                    raw_result_text.generated_text,
                    currentTheme.data.splitChar,
                );
                //console.log("loadBuffer result:", result_text);

                if (result_text.startsWith(".")) {
                    console.log("Skipping invalid result, loading again.");
                    loadBuffer();
                    return;
                }

                fetchPixabayImages(
                    "beer",
                    currentTheme.data.fallbackKeyword,
                ).then((image_url) => {
                    console.log("final buffer:", {
                        text: result_text,
                        image: image_url,
                    });
                    setGeneratedTextBuffer({
                        text: result_text,
                        image: image_url,
                    });
                    setIsBufferLoading(false);
                });
            },
        );
    };

    const handleClick = () => {
        if (isBufferLoading) {
            // if buffer not ready, set main to loading and wait
            setIsMainLoading(true);
            return;
        }
        setGeneratedTextMain(generatedTextBuffer);
        loadBuffer();
    };

    const handleThemeChange = (newTheme) => {
        const newThemeData = {
            name: newTheme,
            data: themedata[newTheme],
        };

        setCurrentTheme(newThemeData);

        setGeneratedTextMain({
            text: null,
            pos: null,
            image: null,
        });
        setGeneratedTextBuffer({
            text: null,
            pos: null,
            image: null,
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-start gap-16 bg-linear-to-b from-blue-200 to-blue-400 p-20">
            <h1 className="flex text-3xl font-bold">
                {currentTheme.data.pageTitle}
            </h1>

            <div className="flex min-h-150 w-fit flex-col items-center gap-8">
                <h2 className="text-2xl italic">
                    Main: loading == {String(isMainLoading)}
                </h2>
                {isMainLoading ? (
                    <p className="text-xl">Loading main...</p>
                ) : (
                    <div className="flex items-start gap-5 text-wrap">
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <p className="text-3xl">Text:</p>
                            <p className="text-xl wrap-break-word">
                                {generatedTextMain.text}
                                {generatedTextMain.text != null &&
                                    currentTheme.data.generatedTextSuffix}
                            </p>
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <p className="text-3xl">POS:</p>
                            <p className="text-xl wrap-break-word">
                                {generatedTextMain.pos}
                            </p>
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <p className="text-3xl">Image:</p>
                            <img
                                className="text-xl wrap-break-word"
                                src={generatedTextMain.image}
                                alt="Generated"
                            />
                        </div>
                    </div>
                )}
                <h2 className="text-2xl italic">
                    Buffer: loading == {String(isBufferLoading)}
                </h2>
                {isBufferLoading ? (
                    <p className="text-2xl">Loading buffer...</p>
                ) : (
                    <div className="flex items-start gap-5">
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <p className="text-3xl">Text:</p>
                            <p className="text-xl wrap-break-word">
                                {generatedTextBuffer.text}
                                {generatedTextBuffer.text != null &&
                                    currentTheme.data.generatedTextSuffix}
                            </p>
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <p className="text-3xl">POS:</p>
                            <p className="text-xl wrap-break-word">
                                {generatedTextBuffer.pos}
                            </p>
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <p className="text-3xl">Image:</p>
                            <img
                                className="text-xl wrap-break-word"
                                src={generatedTextBuffer.image}
                                alt="Generated"
                            />
                        </div>
                    </div>
                )}
            </div>
            <button className="bg-blue-100 p-3 text-2xl" onClick={handleClick}>
                {currentTheme.data.generateButtonText}
            </button>
            <nav className="flex justify-center gap-4">
                <button
                    className="bg-green-200 p-3 text-xl"
                    onClick={() => {
                        handleThemeChange("sauphemismus");
                    }}
                >
                    Sauphemismus
                </button>
                <button
                    className="bg-green-200 p-3 text-xl"
                    onClick={() => {
                        handleThemeChange("faktemismus");
                    }}
                >
                    Faktemismus
                </button>
                <button
                    className="bg-green-200 p-3 text-xl"
                    onClick={() => {
                        handleThemeChange("sprichworte");
                    }}
                >
                    Sprichworte
                </button>
            </nav>
        </div>
    );
}

export default App;
