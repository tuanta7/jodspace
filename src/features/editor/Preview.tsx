import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface PreviewProps {
    contents: string;
}

function Preview({ contents }: PreviewProps) {
    return (
        <div className="h-[80vh] markdown-body p-10 rounded-lg border-2 border-neutral-600">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
                components={{}}
            >
                {contents}
            </ReactMarkdown>
        </div>
    );
}

export default Preview;
