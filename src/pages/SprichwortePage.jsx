import React from "react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import GenerateButton from "../components/GenerateButton.jsx";

const SprichwortePage = () => {
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
    const [currentFont, setCurrentFont] = useState("amatic-sc");

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

    const handleClickExtended = () => {
        handleClick();
        console.log("Generated text main changed:", generatedTextMain.text);

        const fonts = [
            "josefin-slab",
            "bodoni-moda",
            "bitter",
            "amatic-sc",
            "yeseva-one",
        ];
        const random = Math.floor(Math.random() * fonts.length);
        console.log("Selected font:", fonts[random]);
        setCurrentFont(fonts[random]);
    };

    return (
        <div
            className={
                "flex min-h-screen w-full flex-col items-center justify-between bg-cover p-4 text-white " +
                `${currentFont}`
            }
        >
            {/* background image */}
            <div className="absolute inset-0 -z-10 overflow-hidden bg-amber-500">
                <img
                    src={currentImage}
                    alt={currentTheme.data.pageTitle}
                    className="h-full w-full object-cover"
                    style={{
                        filter: imageLoaded
                            ? "blur(0px) contrast(0.9) sepia(0.5) brightness(0.85)"
                            : "blur(5px) contrast(0.9) sepia(0.5) brightness(0.7)",
                        transform: imageLoaded ? "scale(1.1)" : "scale(1.05)",
                        transition: "all 200ms ease-in-out",
                    }}
                />
            </div>

            {/* content */}
            <h1 className="mt-15 text-5xl font-bold text-shadow-black/80 text-shadow-md">
                {currentTheme.data.pageTitle}
            </h1>

            <div className="flex max-w-78 flex-col items-center justify-center p-4 text-center text-4xl text-shadow-black/80 text-shadow-md">
                {isMainLoading ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    <div className="">
                        {generatedTextMain.text &&
                            generatedTextMain.text +
                                currentTheme.data.generatedTextSuffix}
                    </div>
                )}
            </div>

            <GenerateButton onClick={handleClickExtended}>
                {currentTheme.data.generateButtonText}
            </GenerateButton>
        </div>
    );
};

export default SprichwortePage;
