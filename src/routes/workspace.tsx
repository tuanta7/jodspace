import { createFileRoute } from '@tanstack/react-router';
import PomodoroTimer from '../components/PomodoroTimer.tsx';
import TaskList from '../features/tasks/TaskList.tsx';

import 'github-markdown-css/github-markdown.css';
import 'katex/dist/katex.min.css';
import Editor from '../features/editor/Editor.tsx';

export const Route = createFileRoute('/workspace')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="w-full h-max flex max-md:flex-col gap-6 p-3 justify-between">
            <div className="flex flex-col gap-6">
                <PomodoroTimer />
                <TaskList />
            </div>
            <Editor />
        </div>
    );
}
