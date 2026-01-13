import { createFileRoute } from '@tanstack/react-router';
import { SparklesIcon, PencilSquareIcon, LightBulbIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import SpaceList from '../features/SpaceList.tsx';

export const Route = createFileRoute('/board')({
    component: BoardPage,
});

function BoardPage() {
    return (
        <div className="space-y-6 h-[80vh]">
            <div className="sketch-card sketch-tilt-1 p-6">
                <h1 className="sketch-header text-2xl font-bold flex items-center gap-2">
                    <SparklesIcon className="h-6 w-6" />
                    Welcome to your board
                </h1>
                <p className="text-[var(--sketch-pencil)]">Start sketching your ideas, notes, and tasks here!</p>
            </div>
            <div className="md:grid gap-4 md:grid-cols-3 hidden ">
                <div className="sketch-card sketch-tilt-2 cursor-pointer p-4 transition-transform hover:translate-y-[-2px]">
                    <PencilSquareIcon className="h-8 w-8 text-[var(--sketch-accent)]" />
                    <h3 className="mt-2 font-semibold">New Note</h3>
                    <p className="text-sm text-[var(--sketch-pencil)]">Scribble before you forget!</p>
                </div>
                <div className="sketch-card sketch-tilt-1 cursor-pointer p-4 transition-transform hover:translate-y-[-2px]">
                    <LightBulbIcon className="h-8 w-8 text-[var(--sketch-accent)]" />
                    <h3 className="mt-2 font-semibold">Brainstorm</h3>
                    <p className="text-sm text-[var(--sketch-pencil)]">Collaboration with others</p>
                </div>
                <div className="sketch-card sketch-tilt-3 cursor-pointer p-4 transition-transform hover:translate-y-[-2px]">
                    <RocketLaunchIcon className="h-8 w-8 text-[var(--sketch-accent)]" />
                    <h3 className="mt-2 font-semibold">Battleship Game</h3>
                    <p className="text-sm text-[var(--sketch-pencil)]">Sink ships, not productivity</p>
                </div>
            </div>
            <SpaceList />
        </div>
    );
}
