import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ themeData, isOpen, currentFont, setIsOpen }) => {
    const linkClass = ({ isActive }) => {
        return (
            "rounded p-1 px-2 hover:bg-zinc-500 " +
            (isActive ? " bg-zinc-600 font-bold" : " bg-zinc-700")
        );
    };

    return (
        <div
            className={
                `${currentFont} ` +
                `absolute right-0 bottom-0 z-10 mb-2 flex flex-col items-center gap-2 rounded-lg text-xs text-white shadow-sm shadow-black/30 backdrop-blur-xl transition-all duration-200 ease-in-out sm:text-base` +
                ` ${isOpen ? "left-1/2 w-[90%] -translate-x-1/2 bg-zinc-900 p-2 sm:w-150" : "mr-2 bg-black/20 px-2 py-1 pb-1.5 hover:scale-105 hover:bg-black/30"}`
            }
        >
            {isOpen && (
                <>
                    <nav className="grid w-full grid-cols-3 gap-1.5 p-2">
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
                className={isOpen ? "-mt-1 pb-2" : "px-1"}
                onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
            >
                {isOpen ? "Close" : "Other Themes"}
            </button>
        </div>
    );
};

export default Navbar;
