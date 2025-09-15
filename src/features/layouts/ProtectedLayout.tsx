import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUserStore } from '../../store/userStore';
import { useGoogleLoginRedirect } from '../../hooks/useGoogleLoginRedirect';

function ProtectedLayout({ children }: PropsWithChildren) {
    const user = useUserStore((s) => s.user);
    const navigate = useNavigate();
    const googleLoginRedirect = useGoogleLoginRedirect();

    useEffect(() => {
        if (!user) {
            googleLoginRedirect();
        }
    }, [navigate, user, googleLoginRedirect]);

    return <div>{children}</div>;
}

export default ProtectedLayout;
