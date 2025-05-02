import { PropsWithChildren } from 'react';

function ProtectedLayout({ children }: PropsWithChildren) {
    return <div>{children}</div>;
}

export default ProtectedLayout;
