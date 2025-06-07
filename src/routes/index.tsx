import { createFileRoute } from '@tanstack/react-router';
import PomodoroTimer from '../components/PomodoroTimer.tsx';
import TaskList from '../features/tasks/TaskList.tsx';

import 'github-markdown-css/github-markdown.css';
import 'katex/dist/katex.min.css';
import Editor from '../features/editor/Editor.tsx';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <div className="flex max-md:flex-col gap-6">
            <div className="flex flex-col">
                <PomodoroTimer />
                <TaskList />
            </div>
            <div className="flex-1">
                <Editor />
            </div>
        </div>
    );
}
