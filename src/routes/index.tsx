import ProtectedLayout from '../features/layouts/ProtectedLayout.tsx';
import { useEffect, useState } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import PomodoroTimer from '../components/PomodoroTimer/PomodoroTimer.tsx';
import TaskList from '../features/tasks/TaskList.tsx';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css/github-markdown.css';
import remarkMath from 'remark-math';
import { BoldIcon } from '@heroicons/react/24/outline';
import { ItalicIcon } from '@heroicons/react/24/solid';
import * as prettier from 'prettier/standalone';
import * as parserMarkdown from 'prettier/parser-markdown';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    const [preview, setPreview] = useState(false);
    const [contents, setContents] = useState('# Markdown Editor');

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                prettier
                    .format(contents, {
                        parser: 'markdown',
                        printWidth: 80,
                        tabWidth: 4,
                        plugins: [parserMarkdown],
                    })
                    .then((formatted) => {
                        setContents(formatted);
                        console.log('Formatted content:', formatted);
                    });
            }
        });
    });

    return (
        <Fragment>
            <div className="flex max-md:flex-col gap-6 p-3">
                <div>
                    <PomodoroTimer />
                    <TaskList />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-sm w-20" onClick={() => setPreview(!preview)}>
                            {preview ? 'Edit' : 'Preview'}
                        </button>
                        <button className="btn btn-sm w-10">
                            <BoldIcon />
                        </button>
                        <button className="btn btn-sm w-10">
                            <ItalicIcon />
                        </button>
                    </div>
                    <div className="rounded-xl overflow-hidden">
                        {preview ? (
                            <div className="markdown-body p-10 h-full">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {contents}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <Editor
                                className="rounded-xl"
                                height="90vh"
                                defaultLanguage="markdown"
                                value={contents}
                                onChange={(value) => setContents(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    padding: { top: 20, bottom: 20 },
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
            <ProtectedLayout>
                <Outlet />
            </ProtectedLayout>
        </Fragment>
    );
}
