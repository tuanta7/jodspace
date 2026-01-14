import { FC, useState } from 'react';
import { UserGroupIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useAttendanceStore, getInitials } from '../store/attendanceStore';

const BrainstormSpaceAttendance: FC = () => {
    const { attendees, currentUser } = useAttendanceStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const onlineCount = attendees.filter((a) => a.isOnline).length + (currentUser?.isOnline ? 1 : 0);
    const allUsers = currentUser ? [currentUser, ...attendees] : attendees;

    return (
        <div className="sketch-card p-3 flex flex-row lg:flex-col items-center lg:items-center gap-3 lg:gap-0">
            {/* Header */}
            <div className="flex items-center gap-1 lg:mb-3">
                <UserGroupIcon className="h-4 w-4 text-[var(--sketch-accent)]" />
                <span className="text-xs font-semibold text-[var(--sketch-pencil)]">
                    {onlineCount} online
                </span>
            </div>

            {/* Stacked avatars - horizontal on mobile, vertical on desktop */}
            <div className="flex flex-row lg:flex-col -space-x-2 lg:space-x-0 lg:-space-y-2">
                {allUsers.slice(0, isExpanded ? allUsers.length : 4).map((user, index) => (
                    <div
                        key={user.id}
                        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--sketch-paper)] flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform hover:scale-110 hover:z-20"
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
                            className={`absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-[var(--sketch-paper)] ${
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
                    className="lg:mt-2 flex items-center gap-1 text-xs text-[var(--sketch-pencil)] hover:text-[var(--sketch-ink)] transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUpIcon className="h-3 w-3 rotate-90 lg:rotate-0" />
                            <span className="hidden sm:inline">Less</span>
                        </>
                    ) : (
                        <>
                            <ChevronDownIcon className="h-3 w-3 rotate-90 lg:rotate-0" />
                            <span className="hidden sm:inline">+{allUsers.length - 4} more</span>
                            <span className="sm:hidden">+{allUsers.length - 4}</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};


export default BrainstormSpaceAttendance;

