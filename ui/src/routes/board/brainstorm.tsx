import { createFileRoute } from '@tanstack/react-router';
import BrainstormSpace from '../../features/BrainstormSpace';
import BrainstormSpaceAttendance from '../../features/BrainstormSpaceAttendance';

export const Route = createFileRoute('/board/brainstorm')({
    component: BrainstormPage,
});

function BrainstormPage() {
    return (
        <div className="flex h-full flex-col-reverse lg:flex-row justify-center gap-3 px-3 sm:px-6">
            <div className="flex-1 min-h-0">
                <BrainstormSpace />
            </div>
            <BrainstormSpaceAttendance />
        </div>
    );

}
