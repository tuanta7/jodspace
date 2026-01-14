import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useCredentialsStore } from '../store/credentialsStore';
import LoginModal from '../components/LoginModal';

export const Route = createFileRoute('/board')({
    component: BoardPage,
});

function BoardPage() {
    const { isAuthenticated } = useCredentialsStore();
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        // Modal will close and page will re-render with authenticated state
    };

    const handleLoginClose = () => {
        navigate({ to: '/' });
    };

    if (!isAuthenticated) {
        return (
            <LoginModal
                open={true}
                onClose={handleLoginClose}
                onSuccess={handleLoginSuccess}
            />
        );
    }

    return (
        <div className="mx-auto max-w-8xl md:px-6 h-full">
            <Outlet />
        </div>
    );
}
