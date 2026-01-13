import { create } from 'zustand';

export interface Attendee {
    id: string;
    name: string;
    avatar?: string;
    color: string;
    isOnline: boolean;
    lastSeen: Date;
}

interface AttendanceState {
    attendees: Attendee[];
    currentUser: Attendee | null;
    setCurrentUser: (user: Attendee) => void;
    addAttendee: (attendee: Attendee) => void;
    removeAttendee: (id: string) => void;
    updateAttendee: (id: string, updates: Partial<Attendee>) => void;
    setAttendees: (attendees: Attendee[]) => void;
}

const AVATAR_COLORS = [
    '#e07a5f', // Terracotta
    '#81b29a', // Sage
    '#f2cc8f', // Sand
    '#3d405b', // Dark blue
    '#f4a261', // Orange
    '#2a9d8f', // Teal
    '#e76f51', // Coral
    '#264653', // Dark teal
];

export const getRandomColor = () => {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

export const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Mock attendees for demo
const mockAttendees: Attendee[] = [
    { id: '1', name: 'Alice Johnson', color: '#e07a5f', isOnline: true, lastSeen: new Date() },
    { id: '2', name: 'Bob Smith', color: '#81b29a', isOnline: true, lastSeen: new Date() },
    { id: '3', name: 'Carol White', color: '#f2cc8f', isOnline: false, lastSeen: new Date(Date.now() - 300000) },
];

export const useAttendanceStore = create<AttendanceState>((set) => ({
    attendees: mockAttendees,
    currentUser: { id: 'current', name: 'You', color: '#3d405b', isOnline: true, lastSeen: new Date() },

    setCurrentUser: (user) => set({ currentUser: user }),

    addAttendee: (attendee) =>
        set((state) => ({
            attendees: [...state.attendees, attendee],
        })),

    removeAttendee: (id) =>
        set((state) => ({
            attendees: state.attendees.filter((a) => a.id !== id),
        })),

    updateAttendee: (id, updates) =>
        set((state) => ({
            attendees: state.attendees.map((a) =>
                a.id === id ? { ...a, ...updates } : a
            ),
        })),

    setAttendees: (attendees) => set({ attendees }),
}));

