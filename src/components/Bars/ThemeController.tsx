import { ChangeEvent, useState } from 'react';
import { THEMES } from '../../utils/constants.ts';
import { BoltIcon, MoonIcon } from '@heroicons/react/24/solid';

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
            <BoltIcon className="swap-off h-6 w-6" />
            <MoonIcon className="swap-on h-6 w-6 fill-primary-content" />
        </label>
    );
}

export default ThemeController;
