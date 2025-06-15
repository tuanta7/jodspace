import { ChangeEvent, useState } from 'react';
import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

import { THEMES } from '../utils/constants.ts';

interface NavbarProps {
    element: React.ReactNode;
}

function Navbar({ element }: NavbarProps) {
    return (
        <nav className="navbar p-3 flex justify-between items-center">
            <div className="navbar-start">
                <button className="btn btn-sm btn-ghost">
                    <Bars3Icon className="w-6" />
                </button>
                <a href="/" className="text-xl btn btn-ghost p-0 mx-2 no-animation hover:bg-transparent">
                    Gookie Workspace
                </a>
            </div>
            <div className="navbar-end gap-3">
                <ThemeController />
                {element}
            </div>
        </nav>
    );
}

function ThemeController() {
    const [check, setCheck] = useState(localStorage.getItem('use-light-theme') === 'true');

    const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
        setCheck(e.target.checked);
        localStorage.setItem('use-light-theme', String(e.target.checked));
    };

    return (
        <label className="swap swap-flip">
            <input
                type="checkbox"
                className="theme-controller"
                value={THEMES.LIGHT}
                checked={check}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleToggle(e)}
            />
            <span className="swap-off">
                <SunIcon className=" h-6 w-6" />
            </span>
            <span className="swap-on flex items-center">
                <MoonIcon className="h-5 w-5" />
            </span>
        </label>
    );
}

export default Navbar;
