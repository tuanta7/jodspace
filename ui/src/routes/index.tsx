
import { createFileRoute } from '@tanstack/react-router';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon, PencilSquareIcon, RocketLaunchIcon, TicketIcon } from '@heroicons/react/24/outline';
import SpaceList from '../features/SpaceList.tsx';

export const Route = createFileRoute('/')({
    component: Homepage,
});

function Homepage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="sketch-card sketch-tilt-1 p-6">
                <h1 className="sketch-header flex items-center gap-2 text-2xl font-bold">
                    <SparklesIcon className="h-6 w-6 text-yellow-500" />
                    Welcome to JODSPACE
                </h1>
                <p className="text-[var(--sketch-pencil)]">Start sketching your ideas, notes, and tasks here!</p>
            </div>
            <div className="hidden gap-4 md:grid md:grid-cols-4">
                <a href="/board/whiteboard">
                    <div className="sketch-card sketch-tilt-2 flex cursor-pointer items-center gap-3 p-4 transition-transform hover:translate-y-[-2px]">
                        <PencilSquareIcon className="h-6 w-6 text-[var(--sketch-accent)]" />
                        <div>
                            <h3 className="mt-2 font-semibold">Whiteboard</h3>
                            <p className="text-sm text-[var(--sketch-pencil)]">Scribble before you forget!</p>
                        </div>
                    </div>
                </a>
                <a href="/board/brainstorm">
                    <div className="sketch-card sketch-tilt-1 flex cursor-pointer items-center gap-3 p-4 transition-transform hover:translate-y-[-2px]">
                        <LightBulbIcon className="h-6 w-6 text-[var(--sketch-accent)]" />
                        <div>
                            <h3 className="mt-2 font-semibold">Brainstorm</h3>
                            <p className="text-sm text-[var(--sketch-pencil)]">Collaboration with others</p>
                        </div>
                    </div>
                </a>
                <a href="/random">
                    <div className="sketch-card sketch-tilt-3 flex cursor-pointer items-center gap-3 p-4 transition-transform hover:translate-y-[-2px]">
                        <TicketIcon className="h-6 w-6 text-[var(--sketch-accent)]" />
                        <div>
                            <h3 className="mt-2 font-semibold">Random Wheel</h3>
                            <p className="text-sm text-[var(--sketch-pencil)]">CSGO case opening style!</p>
                        </div>
                    </div>
                </a>
                <a href="/battleship">
                    <div className="sketch-card sketch-tilt-2 flex cursor-pointer items-center gap-3 p-4 transition-transform hover:translate-y-[-2px]">
                        <RocketLaunchIcon className="h-6 w-6 text-[var(--sketch-accent)]" />
                        <div>
                            <h3 className="mt-2 font-semibold">Battleship Game</h3>
                            <p className="text-sm text-[var(--sketch-pencil)]">Sink ships, not productivity</p>
                        </div>
                    </div>
                </a>
            </div>
            <SpaceList />
        </div>
    );
}
