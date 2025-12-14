import React from "react";
import { useEffect, useState } from "react";

const BackgroundImageSingle = ({ currentTheme, generatedText, filter }) => {
    const [currentImage, setCurrentImage] = useState(
        currentTheme.data.fallbackImage,
    );
    const [imageLoaded, setImageLoaded] = useState(true);

    useEffect(() => {
        const newImageUrl =
            generatedText.image || currentTheme.data.fallbackImage;

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
    }, [generatedText.image, currentTheme.data.fallbackImage, currentImage]);
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-zinc-900">
            <img
                src={currentImage}
                alt={currentTheme.data.pageTitle}
                className="h-full w-full object-cover"
                style={{
                    filter: imageLoaded
                        ? filter + " blur(0px)"
                        : filter + " blur(5px)",
                    transform: imageLoaded ? "scale(1.1)" : "scale(1.05)",
                    transition: "all 200ms ease-in-out",
                }}
            />
        </div>
    );
};

const BackgroundImage = ({
    currentTheme,
    generatedTextBuffer,
    generatedTextMain,
    filter,
}) => {
    return (
        <>
            <BackgroundImageSingle
                currentTheme={currentTheme}
                generatedText={generatedTextBuffer}
                filter={filter}
            />

            <BackgroundImageSingle
                currentTheme={currentTheme}
                generatedText={generatedTextMain}
                filter={filter}
            />
        </>
    );
};

export default BackgroundImage;
