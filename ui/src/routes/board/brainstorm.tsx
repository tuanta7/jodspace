import { createFileRoute } from '@tanstack/react-router';
import BrainstormSpace from '../../features/BrainstormSpace';

export const Route = createFileRoute('/board/brainstorm')({
    component: BrainstormPage,
});

function BrainstormPage() {
    return <BrainstormSpace />;
}
