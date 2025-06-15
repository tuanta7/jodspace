import { createFileRoute } from '@tanstack/react-router';
import PomodoroTimer from '../components/PomodoroTimer.tsx';

import 'github-markdown-css/github-markdown.css';
import 'katex/dist/katex.min.css';
import Editor from '../features/editor/Editor.tsx';
import TaskList from '../features/tasks/TaskList.tsx';

export const Route = createFileRoute('/workspace')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="w-full h-fit py-3 px-6">
            <div className="flex max-lg:flex-col gap-4 mb-6">
                <TaskList />
                <div className="w-full border-1 border-neutral-600 rounded-lg overflow-hidden">
                    <img src="/public/lake.png" className="object-cover object-center h-[120px] w-full" />
                    <div>Music Player</div>
                </div>
                <PomodoroTimer />
            </div>
            <Editor />
        </div>
    );
}
