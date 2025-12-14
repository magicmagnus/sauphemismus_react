import { useState, useEffect } from "react";
import {
    queryHuggingFaceTextGeneration,
    queryHuggingFaceTokenClassification,
} from "../utils/hf_queries";
import {
    parseGeneratedText,
    parsePosToKeywords,
    fetchPixabayImages,
    createInputPrompt,
    fetchTranslation,
} from "../utils/utils";
import themedata from "../data/data.json";
import Navbar from "../components/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

console.log("themedata loaded:", themedata);

function MainLayout() {
    // handles the state and logic for theme switching, text generation, POS tagging, and image fetching
    // but not the actual rendering of the pages, which is done in the individual page components or
    // in the SauphemismusLayout for shared Sauphemismus-related themes/pages

    const location = useLocation();
    const navigate = useNavigate();

    // Extract theme from URL
    const currentThemeSlug = location.pathname.split("/")[1] || "sauphemismus";

    const [currentTheme, setCurrentTheme] = useState({
        name: currentThemeSlug,
        data: themedata[currentThemeSlug] || themedata.sauphemismus,
    });

    const themeData = themedata;

    const [currentFont, setCurrentFont] = useState(
        currentTheme.name === "bibelzitate" ? "italianno" : "josefin-slab",
    );

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

    const [isMainLoading, setIsMainLoading] = useState(true);
    const [isBufferLoading, setIsBufferLoading] = useState(false);

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    // on first load, start loading buffer
    // useEffect(() => {
    //     loadBuffer();
    // }, []);

    useEffect(() => {
        console.log("Current theme changed to:", currentTheme.name);
        loadBuffer();
        setRandomFont();
    }, [currentTheme]);

    // Update theme when URL changes
    useEffect(() => {
        setIsNavbarOpen(false);
        setIsMainLoading(true);
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
        const newThemeSlug = location.pathname.split("/")[1] || "sauphemismus";
        if (themedata[newThemeSlug] && newThemeSlug !== currentTheme.name) {
            setCurrentTheme({
                name: newThemeSlug,
                data: themedata[newThemeSlug],
            });
        }
    }, [location.pathname, currentTheme.name]);

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
        if (currentTheme.data.needsPOSProcessing) {
            loadBufferWithPOS(); // no special POS processing for these themes needed
        } else {
            loadBufferWithoutPOS();
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
                    currentTheme.data.keywords,
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

    function setRandomFont() {
        if (currentTheme.data.fonts != undefined) {
            const random = Math.floor(
                Math.random() * currentTheme.data.fonts.length,
            );
            setCurrentFont(currentTheme.data.fonts[random]);
        }
    }

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
        <div className="min-h-dvh w-full text-white">
            <Navbar
                themeData={themeData}
                isOpen={isNavbarOpen}
                setIsOpen={setIsNavbarOpen}
            />
            <Outlet
                context={{
                    currentTheme,
                    currentFont,
                    generatedTextMain,
                    generatedTextBuffer,
                    isMainLoading,
                    isBufferLoading,
                    handleClick,
                    setRandomFont,
                }}
            />
        </div>
    );
}

export default MainLayout;
