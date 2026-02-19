import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ themeData, isOpen, currentFont, setIsOpen }) => {
    const linkClass = ({ isActive }) => {
        return (
            "rounded md:rounded-md 2xl:rounded-lg p-2 hover:bg-zinc-500 text-xs md:text-base 2xl:text-lg md:p-3 2xl:p-3" +
            (isActive ? " bg-zinc-700 font-bold" : " bg-zinc-800")
        );
    };

    return (
        <div
            className={
                `${currentFont} ` +
                `absolute bottom-0 left-1/2 z-10 mb-2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-lg text-sm text-white shadow-sm shadow-black/30 backdrop-blur-xl transition-all duration-200 ease-in-out md:mb-4 md:rounded-xl md:text-lg 2xl:rounded-2xl 2xl:text-xl` +
                ` ${isOpen ? "w-[95%] bg-zinc-900 p-2 px-2 md:w-150 2xl:w-190" : "mr-2 bg-black/70 px-2 py-1 pb-1.5 hover:scale-105 hover:bg-black/60 md:mr-4 md:px-3 md:py-2 2xl:mr-6 2xl:px-4 2xl:py-3"}`
            }
        >
            {isOpen && (
                <>
                    <nav className="grid w-full grid-cols-3 gap-1.5 p-1 md:gap-2 md:p-2 2xl:gap-3 2xl:p-3">
                        {Object.keys(themeData).map((themeKey) => (
                            <NavLink
                                key={themeKey}
                                to={`/${themeKey}`}
                                className={linkClass}
                            >
                                {themeData[themeKey].pageTitle || themeKey}
                            </NavLink>
                        ))}
                    </nav>
                </>
            )}
            <button
                className={isOpen ? "mt-1 pb-2" : "px-1 py-0.5"}
                onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
            >
                {isOpen ? "Close" : "Other Themes"}
            </button>
        </div>
    );
};

export default Navbar;
