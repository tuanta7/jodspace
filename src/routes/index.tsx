import { useEffect, useState, useRef } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Home,
});

function Home() {
    const navigate = useNavigate({});

    const features = [
        'Built-in Formatting',
        'Beautiful Math Equations',
        'Instant Live Preview',
        'Sync Across All Devices',
        'Export as PDF Easily',
    ];
    const [typedTitle, setTypedTitle] = useState('');
    const [featureIdx, setFeatureIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (charIdx <= features[featureIdx].length) {
            setTypedTitle(features[featureIdx].slice(0, charIdx));
            typingTimeout.current = setTimeout(() => setCharIdx(charIdx + 1), 100);
        } else {
            intervalTimeout.current = setTimeout(() => {
                setCharIdx(0);
                setFeatureIdx((featureIdx + 1) % features.length);
            }, 1000);
        }
        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            if (intervalTimeout.current) clearTimeout(intervalTimeout.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charIdx, featureIdx]);

    return (
        <div className="bg-base-100 mb-10 flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
            <div className="mb-12 max-w-2xl text-center">
                <h1 className="text-primary mb-10 text-4xl font-extrabold md:text-5xl">
                    <span className="mb-3 block">Jod: Online Markdown</span>
                    <span className=""> & {typedTitle}</span>
                    <span className="border-primary animate-pulse border-r-2 pr-1"></span>
                </h1>
                <p className="mb-6 px-3 text-lg md:text-xl">
                    Effortlessly write, preview, and export Markdown with built-in math support (KaTeX), tables, code,
                    and more. Perfect for students, teachers, and professionals.
                </p>
                <button
                    className="btn btn-primary btn-lg px-8 text-lg shadow-lg"
                    onClick={() => {
                        navigate({
                            to: '/workspace',
                            search: { file: 'new' },
                        });
                    }}
                >
                    Start Writing
                </button>
            </div>

            <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
                <div className="card bg-base-200 items-center gap-3 p-6 shadow-md max-md:flex-row">
                    <span className="mb-2 text-3xl">📝</span>
                    <div className="max-md:ml-3">
                        <h2 className="mb-1 text-lg font-bold">Live Markdown Preview</h2>
                        <p className="text-sm text-neutral-500">
                            See your formatted document as you type, including tables, lists, and code blocks.
                        </p>
                    </div>
                </div>
                <div className="card bg-base-200 items-center gap-3 p-6 shadow-md max-md:flex-row">
                    <span className="mb-2 text-3xl">&Sigma;x</span>
                    <div className="max-md:ml-3">
                        <h2 className="mb-1 text-lg font-bold">Math & KaTeX Support</h2>
                        <p className="text-sm text-neutral-500">
                            Write beautiful math equations and formulas using KaTeX inline or block syntax.
                        </p>
                    </div>
                </div>
                <div className="card bg-base-200 items-center gap-3 p-6 shadow-md max-md:flex-row">
                    <span className="mb-2 text-3xl">⬇️</span>
                    <div className="max-md:ml-3">
                        <h2 className="mb-1 text-lg font-bold">Export & Share</h2>
                        <p className="text-sm text-neutral-500">
                            Export your notes as Markdown or PDF, or share them with a link.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-20 text-center text-sm">
                <p className="mb-2 flex items-center gap-1">
                    Made with <HeartIcon className="text-primary w-4" /> for Markdown & Math lovers.
                </p>
                <a href="https://gitlab.com/jodworkspace" className="link link-primary">
                    View on GitLab
                </a>
            </div>
        </div>
    );
}
