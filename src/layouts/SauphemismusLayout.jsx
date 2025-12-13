import React, { useEffect } from "react";
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

    return (
        <div
            className="flex min-h-screen w-full flex-col items-center justify-around bg-cover bg-fixed bg-center bg-no-repeat p-4 text-white text-shadow-black/30 text-shadow-md"
            style={{
                backgroundImage: `url(${generatedTextMain.image || currentTheme.data.fallbackImage})`,
            }}
        >
            <h1 className="text-4xl font-bold">
                {currentTheme.data.pageTitle}
            </h1>
            <div className="mt-10 flex max-w-[310px] flex-col items-center justify-center rounded-lg bg-black/10 p-4 text-center text-2xl backdrop-blur-xl">
                {currentTheme.data.introText && currentTheme.data.introText}

                {isMainLoading ? (
                    <div className="mt-5 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                    <div className="mt-1 text-2xl">
                        {generatedTextMain.text &&
                            generatedTextMain.text +
                                currentTheme.data.generatedTextSuffix}
                    </div>
                )}
            </div>
            {/* <div className="flex min-h-150 w-fit flex-col items-center gap-8">
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
            </div> */}

            <button
                className="rounded-full border-2 border-black/50 bg-black/10 p-5 text-2xl shadow-md shadow-black/30 backdrop-blur-xl hover:bg-white/10"
                onClick={handleClick}
            >
                {currentTheme.data.generateButtonText}
            </button>
        </div>
    );
};

export default SauphemismusLayout;
