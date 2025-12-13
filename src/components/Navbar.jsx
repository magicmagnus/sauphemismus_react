import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ themeData }) => {
    const linkClass = ({ isActive }) => {
        return (
            "rounded border p-1 hover:bg-gray-200 w-24" +
            (isActive ? " bg-gray-400 font-bold" : " ")
        );
    };

    return (
        <nav className="w-full">
            <ul className="grid w-full grid-cols-3 gap-2">
                {Object.keys(themeData).map((themeKey) => (
                    <li key={themeKey}>
                        <NavLink to={`/${themeKey}`} className={linkClass}>
                            {themeData[themeKey].pageTitle || themeKey}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
