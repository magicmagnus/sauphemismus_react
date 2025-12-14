import React from "react";

const GenerateButton = ({ onClick, children, buttonClassName }) => {
    const buttonClasses = buttonClassName
        ? buttonClassName
        : "mb-15 rounded-xl bg-black/20 p-5 text-2xl shadow-md shadow-black/30 backdrop-blur-xl transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black/30";

    return (
        <button className={buttonClasses} onClick={onClick}>
            {children}
        </button>
    );
};

export default GenerateButton;
