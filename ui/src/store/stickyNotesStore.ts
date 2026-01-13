import { create } from 'zustand';

export interface StickyNote {
    id: string;
    content: string;
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
    zIndex: number;
}

interface StickyNotesState {
    notes: StickyNote[];
    maxZIndex: number;
    addNote: (note: Omit<StickyNote, 'id' | 'zIndex'>) => void;
    updateNote: (id: string, updates: Partial<StickyNote>) => void;
    deleteNote: (id: string) => void;
    bringToFront: (id: string) => void;
}

const STICKY_COLORS = [
    '#fff740', // Classic yellow Post-it
    '#ff7eb9', // Pink
    '#7afcff', // Cyan/Blue
    '#98ff98', // Mint green
    '#ffb347', // Orange
    '#cb99c9', // Lavender
];

export const getRandomColor = () => {
    return STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
};

export const useStickyNotesStore = create<StickyNotesState>((set, get) => ({
    notes: [],
    maxZIndex: 1,

    addNote: (note) => {
        const { maxZIndex } = get();
        const newNote: StickyNote = {
            ...note,
            id: crypto.randomUUID(),
            zIndex: maxZIndex + 1,
        };
        set((state) => ({
            notes: [...state.notes, newNote],
            maxZIndex: maxZIndex + 1,
        }));
    },

    updateNote: (id, updates) => {
        set((state) => ({
            notes: state.notes.map((note) =>
                note.id === id ? { ...note, ...updates } : note
            ),
        }));
    },

    deleteNote: (id) => {
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
        }));
    },

    bringToFront: (id) => {
        const { maxZIndex } = get();
        set((state) => ({
            notes: state.notes.map((note) =>
                note.id === id ? { ...note, zIndex: maxZIndex + 1 } : note
            ),
            maxZIndex: maxZIndex + 1,
        }));
    },
}));
