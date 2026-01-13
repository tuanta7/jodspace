import { FC, useRef } from 'react';
import { PlusIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import StickyNote from '../components/StickyNote';
import { useStickyNotesStore, getRandomColor } from '../store/stickyNotesStore';

const BrainstormSpace: FC = () => {
    const { notes, addNote } = useStickyNotesStore();
    const boardRef = useRef<HTMLDivElement>(null);

    const handleAddNote = () => {
        const board = boardRef.current;
        if (!board) return;

        const boardRect = board.getBoundingClientRect();
        const noteWidth = 200;
        const noteHeight = 200;

        // Random position within the board
        const x = Math.random() * (boardRect.width - noteWidth - 50) + 25;
        const y = Math.random() * (boardRect.height - noteHeight - 50) + 25;

        addNote({
            content: '',
            x,
            y,
            color: getRandomColor(),
            width: noteWidth,
            height: noteHeight,
        });
    };

    return (
        <div className="flex h-full flex-col">
            <div className="sketch-card mb-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold">
                            <LightBulbIcon className="h-6 w-6 text-[var(--sketch-accent)]" />
                            Brainstorm Space
                        </h1>
                        <p className="text-[var(--sketch-pencil)]">
                            Create sticky notes, drag them around, and organize your ideas!
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-[var(--sketch-pencil)]">
                            {notes.length} note{notes.length !== 1 ? 's' : ''}
                        </span>
                        <button
                            onClick={handleAddNote}
                            className="sketch-btn sketch-btn-primary flex items-center gap-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add Note
                        </button>
                    </div>
                </div>
            </div>
            <div
                ref={boardRef}
                className="border-[var(--sketch-border)] relative min-h-[500px] flex-1 overflow-hidden rounded-lg border-2 border-dashed"
            >
                {notes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-[var(--sketch-pencil)]">
                            <LightBulbIcon className="mx-auto mb-4 h-16 w-16 opacity-30" />
                            <p className="mb-2 text-xl">Your brainstorm space is empty!</p>
                            <p className="text-sm">Click "Add Note" to start capturing your ideas</p>
                        </div>
                    </div>
                )}

                {notes.map((note) => (
                    <StickyNote key={note.id} note={note} />
                ))}
            </div>
        </div>
    );
};

export default BrainstormSpace;

