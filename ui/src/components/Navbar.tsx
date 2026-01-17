import { useState } from 'react';
import { Bars3Icon, UserCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import LoginModal from './LoginModal';
import { useCredentialsStore } from '../store/credentialsStore';

interface NavbarProps {
    openSideBar: boolean;
    setOpenSideBar: (open: boolean) => void;
}

function Navbar({ openSideBar, setOpenSideBar }: NavbarProps) {
    const [showLogin, setShowLogin] = useState(false);
    const { user, isAuthenticated, clearCredentials } = useCredentialsStore();

    const handleLogout = () => {
        clearCredentials();
    };

    return (
        <header className="sketch-card mx-4 mt-4">
            <div className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex items-center gap-3">
                    <button
                        aria-label={openSideBar ? 'Close sidebar' : 'Open sidebar'}
                        onClick={() => setOpenSideBar(!openSideBar)}
                        className="sketch-btn px-2 py-1"
                    >
                        <Bars3Icon className="h-5 w-5" />
                    </button>
                    <a href="/" className="flex items-center gap-2 text-[var(--sketch-pencil)]">
                        <span className="sketch-underline text-xl font-semibold tracking-tight">JODSPACE</span>
                    </a>
                </div>

                <nav className="hidden items-center gap-8 md:flex">
                    <a href="/board/whiteboard" className="text-lg transition-colors hover:text-[var(--sketch-accent)]">
                        Whiteboard
                    </a>
                    <a href="/board/brainstorm" className="text-lg transition-colors hover:text-[var(--sketch-accent)]">
                        Brainstorm
                    </a>
                    <a href="/random" className="text-lg transition-colors hover:text-[var(--sketch-accent)]">
                        Random
                    </a>
                    <a href="/battleship" className="text-lg transition-colors hover:text-[var(--sketch-accent)]">
                        Battleship
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-lg bg-[var(--sketch-bg)] px-3 py-1.5">
                                <UserCircleIcon className="h-5 w-5 text-[var(--sketch-accent)]" />
                                <span className="font-medium">
                                    {user.nickname}
                                    {user.isGuest && <span className="ml-1 text-xs text-[var(--sketch-pencil)]">(guest)</span>}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="sketch-btn px-2 py-1.5"
                                title="Logout"
                            >
                                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="sketch-btn sketch-btn-primary">
                            Login
                        </button>
                    )}
                </div>
            </div>

            <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
        </header>
    );
}

export default Navbar;
