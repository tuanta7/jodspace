import { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { editor } from 'monaco-editor';

import {
    FolderOpenIcon,
    BoldIcon,
    ItalicIcon,
    VariableIcon,
    ListBulletIcon,
    CloudArrowUpIcon,
    CodeBracketIcon,
    ArrowUpTrayIcon,
    ShieldExclamationIcon,
    ArrowsRightLeftIcon,
    StrikethroughIcon,
    Squares2X2Icon,
    PhotoIcon,
} from '@heroicons/react/24/outline';

import * as prettier from 'prettier/standalone';
import * as parserMarkdown from 'prettier/parser-markdown';
import ExportButton from './ExportButton';
import Preview from './Preview';

function Editor() {
    const [preview, setPreview] = useState(false);
    const [contents, setContents] = useState(localStorage.getItem('file-name-contents') || '');

    const onContentsChange = (value: string | undefined) => {
        setContents(value || '');
        localStorage.setItem('file-name-contents', value || '');
    };

    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                prettier
                    .format(contents, {
                        parser: 'markdown',
                        printWidth: 120,
                        tabWidth: 4,
                        plugins: [parserMarkdown],
                    })
                    .then((formatted) => {
                        setContents(formatted);
                    });
            }
        };

        document.addEventListener('keydown', keydownHandler);
        return () => document.removeEventListener('keydown', keydownHandler);
    }, [contents]);

    const editorRef = useRef<editor.IEditor | null>(null);
    useEffect(() => {
        const onResize = () => {
            editorRef.current?.layout();
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });

    return (
        <div className="w-full min-h-max  flex flex-col gap-3">
            <div className="flex flex-wrap-reverse justify-between gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                    <button className="btn btn-sm w-10">
                        <BoldIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-sm">
                        <ItalicIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-sm">
                        <StrikethroughIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-sm">
                        <ListBulletIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-sm">
                        <PhotoIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-sm">
                        <Squares2X2Icon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-sm">
                        <CodeBracketIcon className="w-4 h-4" />
                        <span className="hidden md:inline">Code</span>
                    </button>
                    <button className="btn btn-sm">
                        <VariableIcon className="w-4 h-4" />
                        <span className="hidden md:inline">Math</span>
                    </button>
                    <button className="btn btn-sm">
                        <ShieldExclamationIcon className="w-4 h-4" />
                        <span className="hidden md:inline">Alerts</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="btn btn-sm text-primary w-28" onClick={() => setPreview(!preview)}>
                        <ArrowsRightLeftIcon className="w-4 h-4" />
                        {preview ? 'Edit' : 'Preview'}
                    </button>
                    <button className="btn btn-sm">
                        <CloudArrowUpIcon className="w-4 h-4" />
                        <span className="hidden md:inline">Save</span>
                    </button>
                    <button className="btn btn-sm">
                        <FolderOpenIcon className="w-4 h-4" />
                        <span className="hidden md:inline">Open</span>
                    </button>
                    <button className="btn btn-sm">
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        <span className="hidden md:inline">Upload</span>
                    </button>
                    <ExportButton />
                </div>
            </div>
            {preview ? (
                <Preview contents={contents} />
            ) : (
                <MonacoEditor
                    className="border-2 border-neutral-600 rounded-lg overflow-hidden"
                    height="100%"
                    width="100%"
                    defaultLanguage="markdown"
                    value={contents}
                    onChange={onContentsChange}
                    onMount={(editor) => {
                        editorRef.current = editor;
                    }}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        padding: { top: 20, bottom: 20 },
                        smoothScrolling: true,
                        automaticLayout: true,
                        wordWrap: 'on',
                        wordBreak: 'keepAll',
                        wrappingStrategy: 'advanced',
                    }}
                />
            )}
        </div>
    );
}

export default Editor;
