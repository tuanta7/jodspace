import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import {
    ArrowDownTrayIcon,
    FolderOpenIcon,
    BoldIcon,
    ItalicIcon,
    VariableIcon,
    ListBulletIcon,
    CloudArrowUpIcon,
    CodeBracketIcon,
    ArrowUpTrayIcon,
    ShieldExclamationIcon,
    QueueListIcon,
    ArrowsRightLeftIcon,
    StrikethroughIcon,
} from '@heroicons/react/24/outline';

import Preview from './Preview';

import * as prettier from 'prettier/standalone';
import * as parserMarkdown from 'prettier/parser-markdown';

function Editor() {
    const [preview, setPreview] = useState(false);
    const [contents, setContents] = useState(localStorage.getItem('file-name-contents') || ''); // consider IndexedDB for better storage

    const onContentsChange = (value: string | undefined) => {
        setContents(value || '');
        localStorage.setItem('file-name-contents', value || '');
    };

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
                    });
            }
        });
    });

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                    <button className="btn btn-sm w-28 text-primary" onClick={() => setPreview(!preview)}>
                        <ArrowsRightLeftIcon className="w-4" /> {preview ? 'Edit' : 'Preview'}
                    </button>
                    <button className="btn btn-sm">
                        <CloudArrowUpIcon className="w-4" /> Save
                    </button>
                    <button className="btn btn-sm">
                        <FolderOpenIcon className="w-4" /> Open
                    </button>
                    <button className="btn btn-sm">
                        <ArrowDownTrayIcon className="w-4" /> Export
                    </button>
                    <button className="btn btn-sm">
                        <ArrowUpTrayIcon className="w-4" /> Upload
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="btn btn-sm">
                        <BoldIcon className="w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <ItalicIcon className="w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <StrikethroughIcon className="w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <ListBulletIcon className="w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <QueueListIcon className="w-4" /> Table
                    </button>
                    <button className="btn btn-sm">
                        <CodeBracketIcon className="w-4" /> Code
                    </button>
                    <button className="btn btn-sm" disabled={'premium' === 'premium'}>
                        <VariableIcon className="w-4" /> Math
                    </button>
                    <button className="btn btn-sm" disabled={'premium' === 'premium'}>
                        <ShieldExclamationIcon className="w-4" /> Admonitions
                    </button>
                </div>
            </div>
            <div className="h-[80vh] overflow-hidden border-2 border-neutral-700 rounded-lg">
                {preview ? (
                    <div className="markdown-body p-10 h-full">
                        <Preview contents={contents} />
                    </div>
                ) : (
                    <MonacoEditor
                        className=""
                        height="80vh"
                        defaultLanguage="markdown"
                        value={contents}
                        onChange={onContentsChange}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            padding: { top: 20, bottom: 20 },
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Editor;
