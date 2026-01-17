import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();
const router = createRouter({
    routeTree,
    context: {
        queryClient,
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
});

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
                </QueryClientProvider>
            </HelmetProvider>
        </StrictMode>,
    );
}
