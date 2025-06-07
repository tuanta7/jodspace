import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import MainLayout from '../features/layouts/MainLayout';
import { HomeIcon } from '@heroicons/react/24/outline';
import { TOAST_DURATION } from '../utils/constants';

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-2">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-xl">Page not found</p>
            <button className="btn btn-secondary mt-4" onClick={() => (window.location.href = '/')}>
                <HomeIcon className="w-4 h-4" /> Go back
            </button>
        </div>
    ),
});

function RootComponent() {
    return (
        <MainLayout>
            <div className="py-3 px-6">
                <Outlet />
            </div>
            <Toaster position="bottom-right" toastOptions={{ duration: TOAST_DURATION }} />
            <TanStackRouterDevtools position="bottom-right" />
        </MainLayout>
    );
}
