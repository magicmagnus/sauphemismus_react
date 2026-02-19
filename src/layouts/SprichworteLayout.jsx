import { useOutletContext } from "react-router-dom";
import GenerateButton from "../components/GenerateButton.jsx";
import BackgroundImage from "../components/BackgroundImage.jsx";

const SprichworteLayout = () => {
    const {
        currentTheme,
        currentFont,
        generatedTextMain,
        generatedTextBuffer,
        isMainLoading,
        isBufferLoading,
        handleClick,
        setRandomFont,
    } = useOutletContext();

    const handleClickExtended = () => {
        handleClick();
        setRandomFont();
    };

    const textLength = generatedTextMain.text
        ? generatedTextMain.text.length
        : 0;

    const fontSizeClass =
        textLength > 200
            ? "text-2xl md:text-3xl 2xl:text-4xl"
            : textLength > 100
              ? "text-3xl md:text-4xl 2xl:text-5xl"
              : "text-4xl md:text-5xl 2xl:text-6xl";

    //const fonts = currentTheme.data.fonts ? currentTheme.data.fonts : [];

    console.log(
        "Selected font:",
        currentFont,
        "for text length:",
        textLength,
        " size:",
        fontSizeClass,
    );

    return (
        <div
            className={
                "flex min-h-dvh w-full flex-col items-center justify-between bg-cover p-4 text-white " +
                `${currentFont}`
            }
        >
            {/* buffer background image */}
            <BackgroundImage
                currentTheme={currentTheme}
                generatedTextBuffer={generatedTextBuffer}
                generatedTextMain={generatedTextMain}
                filter={"contrast(0.8) sepia(0.5) brightness(0.7)"}
            />

            {/* title */}
            <h1 className="mt-15 text-4xl font-bold text-shadow-black/80 text-shadow-md md:text-6xl 2xl:text-7xl">
                {currentTheme.data.pageTitle}
            </h1>

            {/* main content */}
            <div
                className={
                    `flex max-w-78 flex-col items-center justify-center p-4 text-center text-shadow-black/80 text-shadow-md md:max-w-125 2xl:max-w-150 ` +
                    `${fontSizeClass}`
                }
            >
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

export default SprichworteLayout;
