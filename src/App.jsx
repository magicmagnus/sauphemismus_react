import { useState, useEffect } from "react";
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

const data = themedata.faktemismus;

function App() {
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
    useEffect(() => {
        loadBuffer();
    }, []);

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
        // first fetch the generated text (the main output)
        data.requestData.inputs = createInputPrompt(data.inputPromptArray);
        queryHuggingFaceTextGeneration(data.requestData).then((result) => {
            var result_text = parseGeneratedText(
                result.generated_text,
                data.splitChar,
            );
            console.log("loadBuffer result:", result_text);

            if (result_text.startsWith(".")) {
                console.log("Skipping invalid result, loading again.");
                loadBuffer();
                return;
            }
            fetchTranslation(result_text).then((translation) => {
                console.log("Translation result:", translation);

                // then fetch the POS (NOUN, VERB, etc.) for that text
                queryHuggingFaceTokenClassification({
                    model: "vblagoje/bert-english-uncased-finetuned-pos",
                    inputs: translation,
                    provider: "auto",
                }).then((result) => {
                    var result_pos = parsePosToKeywords(
                        result,
                        data.fallbackKeyword,
                    );
                    console.log("POS result:", result_pos);
                    // finally fetch images from pixabay for that POS keywords

                    var image_url = null;

                    fetchPixabayImages(result_pos, data.fallbackKeyword).then(
                        (response) => {
                            image_url = response;
                            setGeneratedTextBuffer({
                                text: result_text,
                                pos: result_pos,
                                image: image_url,
                            });
                            setIsBufferLoading(false);
                        },
                    );
                });
            });
        });
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

    return (
        <div className="flex min-h-screen flex-col items-center justify-start gap-16 bg-linear-to-b from-blue-200 to-blue-400 p-20">
            <h1 className="flex text-3xl font-bold">Sauphemismus Tester</h1>

            <div className="flex min-h-[900px] w-fit flex-col items-center gap-8">
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
                                    data.generatedTextSuffix}
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
                                    data.generatedTextSuffix}
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
                {data.generateButtonText}
            </button>
        </div>
    );
}

export default App;
