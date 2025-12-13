import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ themeData, isOpen, setIsOpen }) => {
    const linkClass = ({ isActive }) => {
        return (
            "rounded border p-1 hover:bg-slate-500 " +
            (isActive ? " bg-slate-600 font-bold" : " ")
        );
    };

    return (
        <div className="absolute top-0 right-0 flex w-fit flex-col items-end bg-amber-600 p-2 opacity-65">
            {isOpen ? (
                <>
                    <button onClick={() => setIsOpen(false)}>Close</button>
                    <nav className="grid w-full grid-cols-3 gap-1 bg-slate-800 p-2 text-xs text-white md:text-base">
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
            ) : (
                <button onClick={() => setIsOpen(true)}>More Things</button>
            )}
        </div>
    );
};

export default Navbar;
