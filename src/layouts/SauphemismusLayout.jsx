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
                "flex min-h-dvh w-full flex-col items-center justify-between bg-cover p-4 text-white " +
                ` ${currentFont}`
            }
        >
            {/* buffer background image */}
            <BackgroundImage
                currentTheme={currentTheme}
                generatedTextBuffer={generatedTextBuffer}
                generatedTextMain={generatedTextMain}
                filter={"brightness(0.9)"}
            />

            {/* title */}
            <h1 className="mt-15 text-4xl font-bold text-shadow-black/80 text-shadow-md md:text-6xl 2xl:text-7xl">
                {currentTheme.data.pageTitle}
            </h1>

            {/* main content */}
            <p
                className={`max-w-78 flex-col items-center justify-center rounded-md bg-black/10 p-4 text-center text-3xl wrap-break-word backdrop-blur-xl transition-all duration-500 ease-in-out text-shadow-black/80 text-shadow-md md:max-w-150 md:rounded-xl md:p-8 md:text-5xl lg:max-w-170 2xl:max-w-170 2xl:rounded-2xl 2xl:p-12 2xl:text-6xl ${isMainLoading ? "flex" : "inline-block"}`}
            >
                {currentTheme.data.introText && currentTheme.data.introText}

                {isMainLoading ? (
                    <div className="loading loading-spinner mt-7 mb-3"></div>
                ) : (
                    <span className="">
                        {generatedTextMain.text &&
                            generatedTextMain.text +
                                currentTheme.data.generatedTextSuffix}
                    </span>
                )}
            </p>

            <GenerateButton onClick={handleClick}>
                {currentTheme.data.generateButtonText}
            </GenerateButton>
        </div>
    );
};

export default SauphemismusLayout;
