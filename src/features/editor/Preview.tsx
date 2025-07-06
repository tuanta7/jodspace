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
        <div className="markdown-body h-[80vh] overflow-auto rounded-lg border-2 border-neutral-600 p-10">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
                components={{
                    img: ({ ...props }) => (
                        <div className="flex justify-center">
                            <img
                                {...props}
                                className="h-auto max-w-full rounded-lg object-contain"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>
                    ),
                }}
            >
                {contents}
            </ReactMarkdown>
        </div>
    );
}

export default Preview;
