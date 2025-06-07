import ThemeController from './ThemeController.tsx';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Button from '../Button.tsx';
import { UserIcon } from '@heroicons/react/24/outline';
import LoginButton from './LoginButton.tsx';

function Navbar() {
    const isLoggedIn = false;

    return (
        <div className="navbar p-3 flex justify-between items-center">
            <div className="navbar-start">
                <Button className="btn btn-sm btn-ghost">
                    <Bars3Icon className="w-6" />
                </Button>
                <a className="text-xl btn btn-ghost p-0 mx-2 no-animation hover:bg-transparent">Gookie Workspace</a>
            </div>
            <div className="navbar-end gap-3">
                <ThemeController />
                {isLoggedIn ? (
                    <Button className="btn btn-sm btn-ghost">
                        <UserIcon className="w-6" />
                    </Button>
                ) : (
                    <LoginButton />
                )}
            </div>
        </div>
    );
}

export default Navbar;
