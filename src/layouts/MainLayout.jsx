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

import { runBufferPipeline } from "../utils/bufferPipeline";
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
    const currentThemeSlug = location.pathname.split("/")[1] || "faketastisch";

    const [currentTheme, setCurrentTheme] = useState({
        name: currentThemeSlug,
        data: themedata[currentThemeSlug] || themedata.faketastisch,
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
        const newThemeSlug = location.pathname.split("/")[1] || "faketastisch";
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

    const loadBuffer = async () => {
        setIsBufferLoading(true);

        try {
            const result = await runBufferPipeline(
                currentTheme.data,
                loadBuffer, // Pass loadBuffer as retry callback
            );

            console.log("final buffer:", result);
            setGeneratedTextBuffer(result);
        } catch (error) {
            console.error("Buffer loading failed:", error);
        } finally {
            setIsBufferLoading(false);
        }
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
                currentFont={currentFont}
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
