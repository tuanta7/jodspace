import { createFileRoute,  Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/board')({
    component: BoardPage,
});

function BoardPage() {
    return (
        <div className="h-full w-full">
            <Outlet />
        </div>
    );
}
