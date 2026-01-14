import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import { UserIcon } from '@heroicons/react/24/outline';
import { useGuestLogin } from '../hooks/useAuth';
import { toast } from 'sonner';

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ open, onClose, onSuccess }) => {
    const [nickname, setNickname] = useState('');
    const guestLoginMutation = useGuestLogin();

    if (!open) return null;

    const isLoading = guestLoginMutation.isPending;

    const handleGuestStart = () => {
        if (nickname.trim()) {
            guestLoginMutation.mutate(
                { nickname: nickname.trim() },
                {
                    onSuccess: () => {
                        toast.success(`Welcome, ${nickname.trim()}!`);
                        setNickname('');
                        onClose();
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error('Failed to login as guest. Please try again.');
                        console.error('Guest login error:', error);
                    },
                }
            );
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth flow
        toast.info('Google login coming soon!');
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="bg-[var(--sketch-ink)]/30 absolute inset-0 backdrop-blur-sm"
                onClick={isLoading ? undefined : onClose}
            />
            <div className="sketch-card relative z-10 w-full max-w-xs p-6 text-center">
                <div className="mb-4">
                    <h3 className="mt-3 text-2xl font-bold">Hey there!</h3>
                    <p className="mt-1 text-[var(--sketch-pencil)]">Ready to sketch some ideas?</p>
                </div>
                <div className="mb-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sketch-pencil)]" />
                            <input
                                type="text"
                                placeholder="Enter a nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGuestStart()}
                                className="placeholder:text-[var(--sketch-pencil)]/60 w-full rounded-lg border-2 border-[var(--sketch-border)] bg-[var(--sketch-paper)] py-2.5 pl-9 pr-3 text-sm focus:border-[var(--sketch-accent)] focus:outline-none disabled:opacity-50"
                                maxLength={20}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleGuestStart}
                            disabled={!nickname.trim() || isLoading}
                            className="sketch-btn sketch-btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? '...' : 'Go!'}
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-[var(--sketch-pencil)]">Start as a guest — no account needed!</p>
                </div>

                <div className="my-4 flex items-center gap-3 text-xs text-[var(--sketch-pencil)]">
                    <div className="h-px flex-1 bg-[var(--sketch-border)]" />
                    <span>or</span>
                    <div className="h-px flex-1 bg-[var(--sketch-border)]" />
                </div>

                <button
                    type="button"
                    className="sketch-btn flex w-full items-center justify-center gap-3 py-3 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span>Continue with Google</span>
                </button>
                <p className="mt-3 text-xs text-[var(--sketch-pencil)]">
                    Login to save & sync your work across devices
                </p>

                <button
                    onClick={onClose}
                    className="mt-4 text-xs text-[var(--sketch-border)] transition-colors hover:text-[var(--sketch-pencil)]"
                >
                    (click anywhere to close)
                </button>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default LoginModal;
