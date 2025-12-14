import { useEffect, useState } from "react";
import themedata from "../data/data.json";
import { Outlet, useOutletContext } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import GenerateButton from "../components/GenerateButton.jsx";
import BackgroundImage from "../components/BackgroundImage.jsx";

const SauphemismusLayout = () => {
    // create the shared layout for all Sauphemismus related themes/pages
    // the state and handlers are passed down from MainLayout via Outlet context
    // and further passed down to the actual pages via Outlet context againe
    const {
        currentTheme,
        currentFont,
        generatedTextMain,
        generatedTextBuffer,
        isMainLoading,
        isBufferLoading,
        handleClick,
    } = useOutletContext();

    return (
        <div
            className={
                "flex min-h-dvh w-full flex-col items-center justify-between bg-cover p-4 text-white text-shadow-black/30 text-shadow-md" +
                ` ${currentFont}`
            }
        >
            {/* buffer background image */}

            <BackgroundImage
                currentTheme={currentTheme}
                generatedTextBuffer={generatedTextBuffer}
                generatedTextMain={generatedTextMain}
                filter={"brightness(0.95)"}
            />

            {/* title */}
            <h1 className="mt-15 text-4xl font-bold">
                {currentTheme.data.pageTitle}
            </h1>

            {/* main content */}
            <div className="flex max-w-78 flex-col items-center justify-center rounded-md bg-black/20 p-4 text-center text-2xl backdrop-blur-xl transition-all duration-500 ease-in-out">
                {currentTheme.data.introText && currentTheme.data.introText}

                {isMainLoading ? (
                    <span className="loading loading-spinner mt-7 mb-3"></span>
                ) : (
                    <div className="mt-1 text-2xl">
                        {generatedTextMain.text &&
                            generatedTextMain.text +
                                currentTheme.data.generatedTextSuffix}
                    </div>
                )}
            </div>

            <GenerateButton onClick={handleClick}>
                {currentTheme.data.generateButtonText}
            </GenerateButton>
        </div>
    );
};

export default SauphemismusLayout;
