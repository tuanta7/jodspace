import ProtectedLayout from '../features/layouts/ProtectedLayout.tsx';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import PomodoroTimer from '../components/PomodoroTimer/PomodoroTimer.tsx';
import TaskList from '../features/tasks/TaskList.tsx';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <Fragment>
            <div className="flex max-md:flex-col gap-6 p-3">
                <div>
                    <PomodoroTimer />
                    <TaskList />
                </div>
                <div className="flex-1 border rounded-xl">
                    <h2 className="">Focus</h2>
                    <p>Stay focused and productive with our Pomodoro timer.</p>
                </div>
            </div>
            <ProtectedLayout>
                <Outlet />
            </ProtectedLayout>
        </Fragment>
    );
}
