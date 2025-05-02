import { PropsWithChildren } from 'react';
import Navbar, { Footer } from '../../components/Bars';

function MainLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col items-center w-full">
            <Navbar />
            <main className="h-screen w-full">{children}</main>
            <Footer />
        </div>
    );
}

export default MainLayout;
