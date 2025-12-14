import React, { useEffect, useState } from "react";
import themedata from "../data/data.json";
import { Outlet, useOutletContext } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const SauphemismusLayout = () => {
    // create the shared layout for all Sauphemismus related themes/pages
    // the state and handlers are passed down from MainLayout via Outlet context
    // and further passed down to the actual pages via Outlet context againe
    const {
        currentTheme,
        generatedTextMain,
        generatedTextBuffer,
        isMainLoading,
        isBufferLoading,
        handleClick,
    } = useOutletContext();

    const [currentImage, setCurrentImage] = useState(
        currentTheme.data.fallbackImage,
    );
    const [imageLoaded, setImageLoaded] = useState(true);

    useEffect(() => {
        const newImageUrl =
            generatedTextMain.image || currentTheme.data.fallbackImage;

        if (newImageUrl !== currentImage) {
            setImageLoaded(false);

            // Preload the new image
            const img = new Image();
            img.onload = () => {
                setCurrentImage(newImageUrl);
                setImageLoaded(true);
            };
            img.src = newImageUrl;
        }
    }, [
        generatedTextMain.image,
        currentTheme.data.fallbackImage,
        currentImage,
    ]);

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-between bg-cover p-4 text-white text-shadow-black/30 text-shadow-md">
            {/* background image */}
            <div
                className="absolute inset-0 -z-10 overflow-hidden bg-amber-500"
                // style={{
                //     backgroundImage: `url(${currentImage})`,
                //     filter: imageLoaded ? "blur(0px)" : "blur(5px)",
                //     transform: imageLoaded ? "scale(1.0)" : "scale(0.95)",
                //     transition: "all 200ms ease-in-out",
                // }}
            >
                <img
                    src={currentImage}
                    alt={currentTheme.data.pageTitle}
                    className="h-full w-full object-cover"
                    style={{
                        filter: imageLoaded ? "blur(0px)" : "blur(5px)",
                        transform: imageLoaded ? "scale(1.1)" : "scale(1.05)",
                        transition: "all 200ms ease-in-out",
                    }}
                />
            </div>

            {/* content */}
            <h1 className="mt-15 text-4xl font-bold">
                {currentTheme.data.pageTitle}
            </h1>
            <div className="flex max-w-78 flex-col items-center justify-center rounded-lg bg-black/40 p-4 text-center text-2xl backdrop-blur-xl transition-all duration-500 ease-in-out">
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

            <button
                className="mb-15 rounded-full bg-black/40 p-5 text-2xl shadow-md shadow-black/30 backdrop-blur-xl hover:bg-black/30"
                onClick={handleClick}
            >
                {currentTheme.data.generateButtonText}
            </button>
        </div>
    );
};

export default SauphemismusLayout;
