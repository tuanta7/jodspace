import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function ExportButton() {
    return (
        <button className="btn btn-sm">
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
        </button>
    );
}

export default ExportButton;
