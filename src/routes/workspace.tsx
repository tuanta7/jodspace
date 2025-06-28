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
        <div className="h-fit w-full px-6 py-3">
            <div className="mb-6 flex gap-4 max-[1000px]:flex-col">
                <div className="max-h-[200px] min-w-[400px] flex-1 overflow-hidden rounded-lg border">
                    {/* TODO: Use GIPHY online resources for random gifs */}
                    <img src="/flowing.gif" className="h-full w-full object-cover object-center" />
                </div>
                <div className="flex gap-4 max-[600px]:flex-col">
                    <div className="flex max-h-[200px] flex-1 rounded-lg border-1 border-neutral-600 max-[300px]:w-full">
                        <PomodoroTimer />
                    </div>
                    <div className="max-h-[200px] flex-1 rounded-lg border border-neutral-600 max-[300px]:w-full">
                        <TaskList />
                    </div>
                </div>
            </div>
            <Editor />
        </div>
    );
}
