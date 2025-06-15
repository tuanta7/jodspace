import { PropsWithChildren } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoginButton from '../auth/LoginButton';

function MainLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col items-center">
            <Navbar element={<LoginButton />} />
            <main className="w-full">{children}</main>
            <Footer />
        </div>
    );
}

export default MainLayout;
