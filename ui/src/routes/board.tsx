import { createFileRoute,  Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/board')({
    component: BoardPage,
});

function BoardPage() {
    return (
        <div className="mx-auto max-w-8xl h-full">
            <Outlet />
        </div>
    );
}
