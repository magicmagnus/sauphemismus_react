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
            ? "text-2xl md:text-3xl"
            : textLength > 100
              ? "text-3xl md:text-4xl"
              : "text-4xl";

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
            <BackgroundImage
                currentTheme={currentTheme}
                generatedTextBuffer={generatedTextBuffer}
                generatedTextMain={generatedTextMain}
                filter={"contrast(0.9) sepia(0.5) brightness(0.9)"}
            />

            {/* content */}
            <h1 className="mt-15 text-5xl font-bold text-shadow-black/80 text-shadow-md">
                {currentTheme.data.pageTitle}
            </h1>
            {/* {fonts.map((font) => (
                <p
                    key={font}
                    className={`mt-1 text-4xl italic text-shadow-black/80 text-shadow-md ${font}`}
                >
                    Font: {font}
                </p>
            ))} */}

            <div
                className={
                    `flex max-w-78 flex-col items-center justify-center p-4 text-center text-shadow-black/80 text-shadow-md ` +
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
