import { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { editor } from 'monaco-editor';

import {
    FolderOpenIcon,
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

import 'github-markdown-css/github-markdown.css';
import 'katex/dist/katex.min.css';

import * as prettier from 'prettier/standalone';
import * as parserMarkdown from 'prettier/parser-markdown';
import ExportButton from './ExportButton';
import Preview from './Preview';
import BoldButton from './BoldButton';

function Editor() {
    const [preview, setPreview] = useState(false);
    const [contents, setContents] = useState(localStorage.getItem('file-name-contents') || '');
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const onEditorMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    };

    const onContentsChange = (value: string | undefined) => {
        setContents(value || '');
        localStorage.setItem('file-name-contents', value || '');
    };

    useEffect(() => {
        const keydownHandler = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                const formatted = await prettier.format(contents, {
                    parser: 'markdown',
                    printWidth: 120,
                    tabWidth: 4,
                    plugins: [parserMarkdown],
                });
                onContentsChange(formatted);
            }
        };

        document.addEventListener('keydown', keydownHandler);
        return () => document.removeEventListener('keydown', keydownHandler);
    }, [contents]);

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex flex-wrap-reverse justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <BoldButton editorRef={editorRef} />
                    <button className="btn btn-sm">
                        <ItalicIcon className="h-4 w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <StrikethroughIcon className="h-4 w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <ListBulletIcon className="h-4 w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <PhotoIcon className="h-4 w-4" />
                    </button>
                    <button className="btn btn-sm">
                        <Squares2X2Icon className="h-4 w-4" />
                        <span className="hidden md:inline">Table</span>
                    </button>
                    <button className="btn btn-sm">
                        <CodeBracketIcon className="h-4 w-4" />
                        <span className="hidden md:inline">Code</span>
                    </button>
                    <button className="btn btn-sm">
                        <VariableIcon className="h-4 w-4" />
                        <span className="hidden md:inline">Math</span>
                    </button>
                    <button className="btn btn-sm">
                        <ShieldExclamationIcon className="h-4 w-4" />
                        <span className="hidden md:inline">Alerts</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="btn btn-sm text-primary w-28" onClick={() => setPreview(!preview)}>
                        <ArrowsRightLeftIcon className="h-4 w-4" />
                        {preview ? 'Edit' : 'Preview'}
                    </button>
                    <button className="btn btn-sm">
                        <CloudArrowUpIcon className="h-4 w-4" />
                        <span className="hidden md:inline">Save</span>
                    </button>
                    <button className="btn btn-sm">
                        <FolderOpenIcon className="h-4 w-4" />
                        <span className="hidden md:inline">Open</span>
                    </button>
                    <button className="btn btn-sm">
                        <ArrowUpTrayIcon className="h-4 w-4" />
                        <span className="hidden md:inline">Upload</span>
                    </button>
                    <ExportButton contents={contents} />
                </div>
            </div>
            {preview ? (
                <Preview contents={contents} />
            ) : (
                <MonacoEditor
                    className="overflow-hidden rounded-lg border-2 border-neutral-600"
                    height="80vh"
                    width="100%"
                    defaultLanguage="markdown"
                    value={contents}
                    onChange={onContentsChange}
                    onMount={onEditorMount}
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
