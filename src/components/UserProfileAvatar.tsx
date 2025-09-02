import React from 'react';
import { UserProfile, useUserStore } from '../store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/apiClient';

interface UserProfileAvatarProps {
    user: UserProfile;
}

const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({ user }) => {
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: async () => {
            return apiClient.sendRequest('POST', `/oauth/logout`, {
                withCredentials: true,
            });
        },
        onSuccess: () => {
            setUser(null);
            queryClient.clear();
            queryClient.invalidateQueries();
            queryClient.removeQueries();
        },
    });

    const setUser = useUserStore((s) => s.setUser);
    const handleLogout = () => {
        mutate();
    };

    return (
        <div className="dropdown dropdown-end">
            <label
                tabIndex={0}
                className="avatar border-primary/60 flex cursor-pointer items-center justify-evenly rounded-4xl border p-1 transition focus:scale-95"
            >
                <div className="h-8 w-8 rounded-full">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="avatar" />
                    ) : (
                        <span className="bg-primary text-base-100 flex h-full w-full items-center justify-center text-lg font-bold">
                            {user.displayName?.[0] || '?'}
                        </span>
                    )}
                </div>
                <span className="px-3 text-sm max-md:hidden">{user.displayName}</span>
            </label>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-300/90 rounded-box z-[1] mt-3 w-56 p-2 shadow"
            >
                <li className="mb-2">
                    <div className="flex flex-col px-2 py-1">
                        <span className="font-semibold">{user.displayName}</span>
                        <span className="truncate text-xs text-neutral-500">{user.email}</span>
                    </div>
                </li>
                <li>
                    <a href="/profile">Profile</a>
                </li>
                <li>
                    <a href="/settings">Settings</a>
                </li>
                <li>
                    <button className="text-error" onClick={handleLogout}>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default UserProfileAvatar;
