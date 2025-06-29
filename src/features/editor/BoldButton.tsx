import { editor } from 'monaco-editor';
import { BoldIcon } from '@heroicons/react/24/outline';

interface BoldButtonProps {
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

function BoldButton({ editorRef }: BoldButtonProps) {
    const insertBoldText = () => {
        if (!editorRef.current) return;

        const editor = editorRef.current;
        const selection = editor.getSelection();
        const model = editor.getModel();

        if (!selection || !model) return;

        const selectedText = model.getValueInRange(selection);
        if (selectedText) {
            const boldText = `**${selectedText}**`;
            editor.executeEdits('insert-bold', [
                {
                    range: selection,
                    text: boldText,
                },
            ]);

            const newPosition = {
                lineNumber: selection.endLineNumber,
                column: selection.endColumn + 4,
            };
            editor.setPosition(newPosition);
        }

        editor.focus();
    };

    return (
        <button className="btn btn-sm w-10" onClick={insertBoldText}>
            <BoldIcon className="h-4 w-4" />
        </button>
    );
}

export default BoldButton;
