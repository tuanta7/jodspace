import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getRouteApi } from '@tanstack/react-router';

interface ExportButtonProps {
    contents: string;
}

function ExportButton({ contents }: ExportButtonProps) {
    const route = getRouteApi('/workspace');
    const queryParams = route.useSearch({}) as { file: string };

    const exportToMarkdown = () => {
        const blob = new Blob([contents], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${queryParams.file || 'untitled'}.md`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button className="btn btn-sm" onClick={exportToMarkdown}>
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span className="hidden md:inline">Export</span>
        </button>
    );
}

export default ExportButton;
