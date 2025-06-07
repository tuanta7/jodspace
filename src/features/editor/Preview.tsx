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
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{}}
        >
            {contents}
        </ReactMarkdown>
    );
}

export default Preview;
