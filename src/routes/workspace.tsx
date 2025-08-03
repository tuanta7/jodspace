import { createFileRoute } from '@tanstack/react-router';
import PomodoroTimer from '../components/PomodoroTimer.tsx';

import Editor from '../features/editor/Editor.tsx';
import TaskList from '../features/tasks/TaskList.tsx';
import Gif from '../features/gif/Gif.tsx';

export const Route = createFileRoute('/workspace')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="h-fit w-full px-6 py-3">
            <div className="mb-6 flex flex-wrap gap-4 max-[1200px]:flex-col">
                <div className="max-h-[250px] flex-1 overflow-hidden rounded-lg border border-neutral-600 max-[900px]:hidden">
                    <Gif />
                </div>
                <div className="flex flex-1 gap-4 max-[800px]:flex-col">
                    <div className="max-h-[250px] flex-1 rounded-lg border border-neutral-600 max-[300px]:w-full">
                        <TaskList />
                    </div>
                    <div className="max-h-[250px] flex-1 rounded-lg border-1 border-neutral-600 max-[300px]:w-full">
                        <PomodoroTimer />
                    </div>
                </div>
            </div>
            <Editor />
        </div>
    );
}
