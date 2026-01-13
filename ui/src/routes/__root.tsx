import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Fragment, useState } from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => (
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
            <div className="sketch-card p-8 text-center sketch-tilt-2">
                <span className="text-6xl">🔍</span>
                <h1 className="mt-4 text-4xl font-bold">404</h1>
                <p className="mt-2 text-lg text-[var(--sketch-pencil)]">
                    Oops! This page got lost in the sketches...
                </p>
                <a href="/" className="sketch-btn sketch-btn-primary mt-6 inline-block">
                    ← Back to Board
                </a>
            </div>
        </div>
    ),
});

function RootComponent() {
    const [openSideBar, setOpenSideBar] = useState(false);

    return (
        <Fragment>
            <div className="min-h-screen">
                <Sidebar open={openSideBar} onClose={() => setOpenSideBar(false)} />
                <Navbar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
                <main className="h-[90vh] w-full px-4 py-6">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <TanStackRouterDevtools position="bottom-right" />
        </Fragment>
    );
}
