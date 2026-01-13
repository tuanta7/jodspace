import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import LoginModal from './LoginModal';

interface NavbarProps {
    openSideBar: boolean;
    setOpenSideBar: (open: boolean) => void;
}

function Navbar({ openSideBar, setOpenSideBar }: NavbarProps) {
    const [showLogin, setShowLogin] = useState(false);

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

                <nav className="hidden items-center gap-4 md:flex">
                    <a href="/board/note" className="transition-colors hover:text-[var(--sketch-accent)]">
                        Note
                    </a>
                    <a href="/board/brainstorm" className="transition-colors hover:text-[var(--sketch-accent)]">
                        Brainstorm
                    </a>
                    <a href="/battleship" className="transition-colors hover:text-[var(--sketch-accent)]">
                        Battleship
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <button onClick={() => setShowLogin(true)} className="sketch-btn sketch-btn-primary">
                        Login
                    </button>
                </div>
            </div>

            <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
        </header>
    );
}

export default Navbar;
