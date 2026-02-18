import { useOutletContext } from "react-router-dom";
import GenerateButton from "../components/GenerateButton.jsx";
import BackgroundImage from "../components/BackgroundImage.jsx";
import { FaBrain } from "react-icons/fa6";

const FaketastischPage = () => {
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
            ? "text-sm "
            : textLength > 100
              ? "text-md "
              : "text-lg";

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
                filter={"contrast(0.9) blur(2px) brightness(0.2)"}
            />

            {/* content */}
            <h1 className="mt-15 text-5xl font-extrabold text-shadow-black/80 text-shadow-md">
                {currentTheme.data.pageTitle.toUpperCase()}
            </h1>

            <div
                className={
                    `relative flex h-85 w-85 flex-col items-center justify-center overflow-hidden rounded-md border-2 border-(--fred) p-6 ` +
                    `${fontSizeClass}`
                }
            >
                {/* Card background image - contained within the card */}
                <div className="absolute inset-0 -z-10">
                    <img
                        src={
                            generatedTextMain.image ||
                            currentTheme.data.fallbackImage
                        }
                        // alt={currentTheme.data.pageTitle}
                        className="h-full w-full object-cover"
                        style={{
                            filter: "contrast(0.9) brightness(0.5)",
                        }}
                    />
                </div>
                <div className="absolute inset-0 mt-6 ml-6 flex h-12 w-12 items-center justify-center bg-(--fred)">
                    <FaBrain className="text-3xl text-white" />
                </div>
                <div className="absolute bottom-0 left-1/2 mb-4 flex h-fit w-fit -translate-x-1/2 flex-col items-center justify-center">
                    <p className="w-full bg-(--fred) pb-0.5 text-center text-xs font-bold">
                        {currentTheme.data.pageTitle.toUpperCase()}
                    </p>
                    <p className="text-[0.45rem] font-light opacity-80 text-shadow-black/80 text-shadow-md">
                        {currentTheme.data.pageTitle.toLowerCase() +
                            ".netlify.app/" +
                            currentTheme.data.pageTitle.toLowerCase()}
                    </p>
                </div>
                {isMainLoading ? (
                    <span className="loading loading-spinner h-12 w-12 text-(--fred)"></span>
                ) : (
                    <div className="text-left leading-tight font-bold text-shadow-black/80 text-shadow-md">
                        {generatedTextMain.text &&
                            generatedTextMain.text +
                                currentTheme.data.generatedTextSuffix}
                    </div>
                )}
            </div>

            <GenerateButton
                onClick={handleClickExtended}
                buttonClassName="mb-15 rounded-md bg-(--fred) p-5 text-2xl font-bold shadow-md shadow-black/30  transition-all duration-200 ease-in-out hover:scale-105 "
            >
                {currentTheme.data.generateButtonText}
            </GenerateButton>
        </div>
    );
};

export default FaketastischPage;
