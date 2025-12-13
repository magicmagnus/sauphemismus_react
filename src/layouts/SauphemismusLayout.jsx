import React, { useEffect } from "react";
import themedata from "../data/data.json";
import { Outlet, useOutletContext } from "react-router-dom";

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

    console.log("SauphemismusPage rendered");
    console.log("Current theme:", currentTheme);
    return (
        <>
            <h1 className="flex text-3xl font-bold">
                {currentTheme.data.pageTitle}
            </h1>
            <button className="bg-blue-100 p-3 text-2xl" onClick={handleClick}>
                {currentTheme.data.generateButtonText}
            </button>
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
        </>
    );
};

export default SauphemismusLayout;
