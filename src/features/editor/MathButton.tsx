import { useState } from 'react';
import { VariableIcon } from '@heroicons/react/24/outline';
import { editor } from 'monaco-editor';

const MATH_SNIPPETS = [
    {
        label: 'Integral',
        markdown: '\\int_{a}^{b} f(x) \\, dx',
        preview: '$$ \\int_{a}^{b} f(x) \\, dx $$',
    },
    {
        label: 'Sigma (Sum)',
        markdown: '\\sum_{n=1}^{\\infty} a_n',
        preview: '$$ \\sum_{n=1}^{\\infty} a_n $$',
    },
    {
        label: 'Derivative',
        markdown: '\\frac{d}{dx} f(x)',
        preview: '$$ \\frac{d}{dx} f(x) $$',
    },
];

interface MathButtonProps {
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

function MathButton({ editorRef }: MathButtonProps) {
    const [open, setOpen] = useState(false);

    const insertSnippet = (snippet: string) => {
        if (!editorRef.current) return;

        const editor = editorRef.current;
        const pos = editor.getPosition();
        const model = editor.getModel();

        if (!pos || !model) return;

        editor.executeEdits('insert-math', [
            {
                range: {
                    startLineNumber: pos.lineNumber,
                    startColumn: pos.column,
                    endLineNumber: pos.lineNumber,
                    endColumn: pos.column,
                },
                text: `$${snippet}$`,
            },
        ]);
        editor.focus();
        setOpen(false);
    };

    return (
        <div className="dropdown" onClick={() => setOpen(!open)} tabIndex={0}>
            <div className="btn" aria-label="Insert math equation">
                <VariableIcon className="h-4 w-4" />
                <span className="hidden md:inline">Math</span>
            </div>
            {open && (
                <ul className="dropdown-content menu bg-base-100 rounded-box z-50 mt-2 w-64 shadow-lg">
                    {MATH_SNIPPETS.map((item) => (
                        <li key={item.label}>
                            <button
                                className="hover:bg-base-200 flex w-full flex-col items-start rounded px-2 py-1"
                                onClick={() => insertSnippet(item.markdown)}
                            >
                                <span className="mb-1 text-sm font-semibold">{item.label}</span>
                                <span className="mb-1 font-mono text-xs text-neutral-500">{item.markdown}</span>
                                <span className="katex-preview" dangerouslySetInnerHTML={{ __html: item.preview }} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MathButton;
