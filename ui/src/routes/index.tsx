import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: RedirectToBoard,
});

function RedirectToBoard() {
    const navigate = useNavigate({});
    useEffect(() => {
        navigate({ to: '/board' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}
