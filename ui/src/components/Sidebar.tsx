import { FC, ReactNode } from 'react';
import { XMarkIcon, PencilSquareIcon, LightBulbIcon, RocketLaunchIcon, Cog6ToothIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

interface NavItem {
    icon: ReactNode;
    label: string;
    href: string;
    description: string;
}

interface ExtraItem {
    icon: ReactNode;
    label: string;
    href: string;
}

const Sidebar: FC<SidebarProps> = ({ open, onClose }) => {
    const navItems: NavItem[] = [
        { icon: <PencilSquareIcon className="h-6 w-6" />, label: 'Note', href: '#', description: 'Scribble your thoughts' },
        { icon: <LightBulbIcon className="h-6 w-6" />, label: 'Brainstorm', href: '/board', description: 'Collaborate & create' },
        { icon: <RocketLaunchIcon className="h-6 w-6" />, label: 'Battleship', href: '/board', description: 'Fun game break' },
    ];

    const extraItems: ExtraItem[] = [
        { icon: <Cog6ToothIcon className="h-5 w-5" />, label: 'Settings', href: '#' },
        { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, label: 'Help', href: '#' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[998] bg-[var(--sketch-ink)]/20 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Sidebar panel */}
            <aside
                className={`fixed left-0 top-0 z-[999] h-full w-72 transform bg-[var(--sketch-paper)] shadow-xl transition-transform duration-300 ease-out ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--sketch-border)] p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">JODSPACE</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="sketch-btn p-1"
                        aria-label="Close sidebar"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>


                <nav className="p-4">
                    <p className="mb-3 text-xs font-semibold uppercase text-[var(--sketch-pencil)]">
                        Quick Actions
                    </p>
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="sketch-card flex items-center gap-3 p-3 transition-all hover:translate-x-1 hover:bg-[var(--sketch-highlight)]/30"
                                    onClick={onClose}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <p className="font-semibold">{item.label}</p>
                                        <p className="text-xs text-[var(--sketch-pencil)]">
                                            {item.description}
                                        </p>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Divider */}
                <div className="mx-4 my-2 flex items-center gap-2 text-[var(--sketch-border)]">
                    <span>~</span>
                    <div className="h-px flex-1 bg-[var(--sketch-border)]" />
                    <span>~</span>
                </div>

                {/* Extra items */}
                <nav className="p-4">
                    <ul className="space-y-1">
                        {extraItems.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-md px-3 py-2 text-[var(--sketch-pencil)] transition-colors hover:bg-[var(--sketch-highlight)]/20 hover:text-[var(--sketch-ink)]"
                                    onClick={onClose}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer doodle */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <div className="flex justify-center gap-1 text-[var(--sketch-border)]">
                        <SparklesIcon className="h-4 w-4" />
                    </div>
                    <p className="mt-1 text-xs text-[var(--sketch-pencil)]">
                        Sketch your dreams
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

