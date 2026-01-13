import { FC, useState } from 'react';
import { UserGroupIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useAttendanceStore, getInitials } from '../store/attendanceStore';

const BrainstormSpaceAttendance: FC = () => {
    const { attendees, currentUser } = useAttendanceStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const onlineCount = attendees.filter((a) => a.isOnline).length + (currentUser?.isOnline ? 1 : 0);
    const allUsers = currentUser ? [currentUser, ...attendees] : attendees;

    return (
        <div className="sketch-card p-3 flex flex-col items-center">
            {/* Header */}
            <div className="flex items-center gap-1 mb-3">
                <UserGroupIcon className="h-4 w-4 text-[var(--sketch-accent)]" />
                <span className="text-xs font-semibold text-[var(--sketch-pencil)]">
                    {onlineCount} online
                </span>
            </div>

            {/* Vertical stacked avatars */}
            <div className="flex flex-col -space-y-2">
                {allUsers.slice(0, isExpanded ? allUsers.length : 4).map((user, index) => (
                    <div
                        key={user.id}
                        className="relative w-10 h-10 rounded-full border-2 border-[var(--sketch-paper)] flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform hover:scale-110 hover:z-20"
                        style={{
                            backgroundColor: user.color,
                            zIndex: 10 - index,
                        }}
                        title={`${user.name}${user.id === currentUser?.id ? ' (you)' : ''}${user.isOnline ? '' : ' - offline'}`}
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            getInitials(user.name)
                        )}
                        {/* Online indicator */}
                        <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--sketch-paper)] ${
                                user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                        />
                    </div>
                ))}
            </div>

            {/* Show more/less button */}
            {allUsers.length > 4 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 flex items-center gap-1 text-xs text-[var(--sketch-pencil)] hover:text-[var(--sketch-ink)] transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUpIcon className="h-3 w-3" />
                            Less
                        </>
                    ) : (
                        <>
                            <ChevronDownIcon className="h-3 w-3" />
                            +{allUsers.length - 4} more
                        </>
                    )}
                </button>
            )}
        </div>
    );
};


export default BrainstormSpaceAttendance;

