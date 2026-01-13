import { FC, useState, useRef, useEffect } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { StickyNote as StickyNoteType, useStickyNotesStore } from '../store/stickyNotesStore';

interface StickyNoteProps {
    note: StickyNoteType;
}

const StickyNote: FC<StickyNoteProps> = ({ note }) => {
    const { updateNote, deleteNote, bringToFront } = useStickyNotesStore();
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const noteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isEditing) return;

        bringToFront(note.id);
        setIsDragging(true);
        const rect = noteRef.current?.getBoundingClientRect();
        if (rect) {
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const parent = noteRef.current?.parentElement;
            if (!parent) return;

            const parentRect = parent.getBoundingClientRect();
            const newX = e.clientX - parentRect.left - dragOffset.x;
            const newY = e.clientY - parentRect.top - dragOffset.y;

            updateNote(note.id, {
                x: Math.max(0, Math.min(newX, parentRect.width - note.width)),
                y: Math.max(0, Math.min(newY, parentRect.height - note.height)),
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, note.id, note.width, note.height, updateNote]);

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    return (
        <div
            ref={noteRef}
            className={`absolute group select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-transform duration-75`}
            style={{
                left: note.x,
                top: note.y,
                width: note.width,
                height: note.height,
                zIndex: note.zIndex,
                transform: isDragging ? 'rotate(-2deg) scale(1.02)' : 'rotate(0deg)',
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Main note body */}
            <div
                className="relative w-full h-full"
                style={{
                    backgroundColor: note.color,
                    boxShadow: isDragging
                        ? '8px 8px 20px rgba(0,0,0,0.25), 0 0 40px rgba(0,0,0,0.1)'
                        : '2px 4px 8px rgba(0,0,0,0.12), 1px 2px 4px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.2s ease',
                }}
            >
                {/* Sticky adhesive strip at top */}
                <div
                    className="absolute top-0 left-0 right-0 h-6"
                    style={{
                        background: `linear-gradient(180deg, 
                            rgba(0,0,0,0.04) 0%, 
                            rgba(0,0,0,0.02) 40%, 
                            transparent 100%)`,
                    }}
                />

                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                <div
                    className="absolute bottom-0 left-0 right-8 h-3 pointer-events-none"
                    style={{
                        background: `linear-gradient(180deg, 
                            transparent 0%, 
                            rgba(0,0,0,0.03) 60%, 
                            rgba(0,0,0,0.06) 100%)`,
                    }}
                />
                <button
                    className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer group/fold transition-all duration-200 hover:w-10 hover:h-10 z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                    }}
                    title="Click to delete"
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(315deg, 
                                rgba(0,0,0,0.15) 0%, 
                                rgba(0,0,0,0.08) 40%,
                                transparent 60%)`,
                        }}
                    />
                    <div
                        className="absolute bottom-0 right-0 w-full h-full"
                        style={{
                            background: `linear-gradient(315deg, 
                                ${note.color} 0%, 
                                ${note.color} 50%,
                                transparent 50%)`,
                            filter: 'brightness(0.9)',
                        }}
                    />
                    <TrashIcon className="absolute bottom-1 right-1 h-3.5 w-3.5  opacity-0 group-hover/fold:opacity-100 transition-opacity" />
                </button>
                <div className="relative h-full p-4 pt-5">
                    <button
                        className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/10 rounded-full z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                    >
                        <PencilIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            className="w-full h-full resize-none bg-transparent outline-none text-gray-700 leading-relaxed"
                            style={{
                                fontFamily: "'Patrick Hand', cursive",
                                fontSize: '1.1rem',
                            }}
                            value={note.content}
                            onChange={(e) => updateNote(note.id, { content: e.target.value })}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <p
                            className="w-full h-full overflow-hidden text-gray-700 whitespace-pre-wrap leading-relaxed"
                            style={{
                                fontFamily: "'Patrick Hand', cursive",
                                fontSize: '1.1rem',
                            }}
                        >
                            {note.content || 'Write your idea here...'}
                        </p>
                    )}
                </div>

                {/* Left edge shadow for depth */}
                <div
                    className="absolute top-0 left-0 bottom-0 w-px pointer-events-none"
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)',
                    }}
                />
            </div>
        </div>
    );
};

export default StickyNote;

