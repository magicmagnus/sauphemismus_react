import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ themeData, isOpen, setIsOpen }) => {
    const linkClass = ({ isActive }) => {
        return (
            "rounded p-1 px-2 hover:bg-zinc-500 " +
            (isActive ? " bg-zinc-600 font-bold" : " bg-zinc-700")
        );
    };

    return (
        <div
            className={`absolute right-0 bottom-0 z-10 mb-2 flex flex-col items-center gap-2 rounded-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 ease-in-out ${isOpen ? "left-1/2 min-w-85 -translate-x-1/2 bg-zinc-900 p-2" : "mr-2 bg-black/20 px-2 py-1 pb-1.5 hover:bg-black/30"}`}
        >
            {isOpen ? (
                <>
                    <nav className="grid w-full grid-cols-3 gap-1.5 p-2 text-xs text-white md:text-base">
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
                    <button
                        className="-mt-1 pb-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </button>
                </>
            ) : (
                <button
                    className="px-2 py-1 text-sm text-white italic"
                    onClick={() => setIsOpen(true)}
                >
                    More
                </button>
            )}
        </div>
    );
};

export default Navbar;
