import { useOutletContext } from "react-router-dom";
import GenerateButton from "../components/GenerateButton.jsx";
import BackgroundImage from "../components/BackgroundImage.jsx";
import { PulseLoader } from "react-spinners";

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

    // const fontName =
    //     currentTheme.name == "justgptthings" ? "font-[TimesNewRoman]" : "";

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
                filter={"contrast(0.8) sepia(0.5) brightness(0.9)"}
            />

            {/* title */}
            <h1 className="mt-15 text-4xl font-bold text-shadow-black/80 text-shadow-md md:text-6xl 2xl:text-7xl">
                {currentTheme.data.pageTitle}
            </h1>

            {/* main content */}
            <div
                className={`flex max-w-78 flex-col items-center justify-center p-4 text-center text-shadow-[0_0_6px_rgba(0,0,0,1),0_0_10px_rgba(0,0,0,0.7)] md:max-w-125 2xl:max-w-150 ${fontSizeClass} `}
            >
                {/* current font name and example */}
                {/* <div className="mt-4 text-zinc-300 text-shadow-[0_0_4px_rgba(0,0,0,1),0_0_7px_rgba(0,0,0,0.7)]">
                    {currentFont}
                </div> */}
                {isMainLoading ? (
                    <div class="loader">
                        <div class="loader-inner">
                            <div class="loader-line-wrap">
                                <div class="loader-line"></div>
                            </div>
                            <div class="loader-line-wrap">
                                <div class="loader-line"></div>
                            </div>
                            <div class="loader-line-wrap">
                                <div class="loader-line"></div>
                            </div>
                            <div class="loader-line-wrap">
                                <div class="loader-line"></div>
                            </div>
                            <div class="loader-line-wrap">
                                <div class="loader-line"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="">
                            {generatedTextMain.text &&
                                generatedTextMain.text +
                                    currentTheme.data.generatedTextSuffix}
                        </div>
                        {currentTheme.name == "justgptthings" && (
                            <div className="mt-4 font-[CharlesScript] text-base text-zinc-300 text-shadow-[0_0_4px_rgba(0,0,0,1),0_0_7px_rgba(0,0,0,0.7)] md:text-2xl 2xl:text-3xl">
                                justgptthings
                            </div>
                        )}
                    </>
                )}
            </div>
            <GenerateButton onClick={handleClickExtended}>
                {currentTheme.data.generateButtonText}
            </GenerateButton>
        </div>
    );
};

export default SprichworteLayout;
