import React from "react";

const GenerateButton = ({ onClick, children, buttonClassName }) => {
    const buttonClasses = buttonClassName
        ? buttonClassName
        : "mb-16 md:mb-20 2xl:mb-24 rounded-xl bg-black/70 px-6 py-5 text-2xl shadow-md shadow-black/30 backdrop-blur-xl transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black/60 md:text-3xl 2xl:text-4xl md:px-8 md:py-7 2xl:px-10 2xl:py-9 ";

    return (
        <button className={buttonClasses} onClick={onClick}>
            {children}
        </button>
    );
};

export default GenerateButton;
