import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useCallback } from 'react';
import { PlusIcon, TrashIcon, PlayIcon, ArrowPathIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export const Route = createFileRoute('/random')({
    component: RandomWheel,
});

const ITEM_WIDTH = 160;

const COLORS = [

    '#81b29a', // soft
    '#f2cc8f', // highlight
    '#3d405b', // dark blue
    '#f4f1de', // cream
    '#e9c46a', // yellow
    '#2a9d8f', // teal

    '#264653', // dark teal
    '#a8dadc', // light blue
];

function RandomWheel() {
    const [names, setNames] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);
    const [newName, setNewName] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const stripRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create a long strip of names for the spinning effect
    const createStrip = useCallback(() => {
        if (names.length === 0) return [];
        // Repeat names many times for smooth scrolling effect
        const repeats = Math.ceil(100 / names.length) + 10;
        const strip: { name: string; color: string }[] = [];
        for (let i = 0; i < repeats; i++) {
            names.forEach((name, idx) => {
                strip.push({
                    name,
                    color: COLORS[(i * names.length + idx) % COLORS.length],
                });
            });
        }
        return strip;
    }, [names]);

    const strip = createStrip();

    const addName = () => {
        if (newName.trim() && !names.includes(newName.trim())) {
            setNames([...names, newName.trim()]);
            setNewName('');
        }
    };

    const removeName = (index: number) => {
        setNames(names.filter((_, i) => i !== index));
    };

    const spin = () => {
        if (names.length === 0 || isSpinning) return;

        setIsSpinning(true);
        setWinner(null);
        setShowModal(false);

        // Random winner index
        const winnerIndex = Math.floor(Math.random() * names.length);

        // Calculate final position - spin through many items then land on winner
        const spinsBeforeStop = 5 + Math.floor(Math.random() * 3); // 5-7 full cycles
        const itemsToSpin = spinsBeforeStop * names.length + winnerIndex;
        const finalOffset = itemsToSpin * ITEM_WIDTH;

        // Animate the strip
        if (stripRef.current) {
            stripRef.current.style.transition = 'none';
            stripRef.current.style.transform = `translateX(0px)`;

            // Force reflow
            void stripRef.current.offsetHeight;

            // Start animation with easing
            stripRef.current.style.transition = 'transform 6s cubic-bezier(0.15, 0.85, 0.4, 1)';
            stripRef.current.style.transform = `translateX(-${finalOffset}px)`;
        }


        // Set winner after animation
        setTimeout(() => {
            setWinner(names[winnerIndex]);
            setShowModal(true);
            setIsSpinning(false);
        }, 6000);
    };

    const reset = () => {
        setWinner(null);
        setShowModal(false);
        if (stripRef.current) {
            stripRef.current.style.transition = 'none';
            stripRef.current.style.transform = 'translateX(0px)';
        }
    };

    const handleRemoveWinner = () => {
        if (winner) {
            setNames(names.filter((n) => n !== winner));
        }
        setShowModal(false);
        setWinner(null);
        reset();
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

                // Extract names from all cells, skip empty cells
                const importedNames = jsonData
                    .flat()
                    .filter((cell): cell is string | number =>
                        cell !== null && cell !== undefined && String(cell).trim() !== ''
                    )
                    .map((cell) => String(cell).trim())
                    .filter((name) => name.length > 0);

                if (importedNames.length > 0) {
                    // Add unique names only
                    const uniqueNewNames = importedNames.filter((name) => !names.includes(name));
                    setNames([...names, ...uniqueNewNames]);
                }
            } catch (error) {
                console.error('Error reading file:', error);
            }
        };
        reader.readAsBinaryString(file);

        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-4 px-4">
            {/* Winner Modal */}
            {showModal && winner && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="sketch-card relative mx-4 w-full max-w-md rounded-xl p-6 text-center animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-3 top-3 text-[var(--sketch-pencil)] hover:text-[var(--sketch-ink)]"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        <div className="text-5xl mb-4">🎉</div>
                        <h2 className="text-lg text-[var(--sketch-pencil)] mb-2">The winner is...</h2>
                        <div className="text-3xl font-bold text-[var(--sketch-accent)] mb-6">{winner}</div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="sketch-btn sketch-btn-primary w-full rounded-lg px-4 py-2"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleRemoveWinner}
                                className="sketch-btn flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2 text-red-500 hover:bg-red-50"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Remove Winner & Spin Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="sketch-card rounded-xl p-4 text-center">
                <h1 className="sketch-header text-2xl font-bold">Random Picker</h1>
                <div className="relative overflow-hidden rounded-lg" style={{ height: '90px' }}>
                    <div className="absolute left-1/2 top-0 z-20 h-full w-1 -translate-x-1/2 bg-[var(--sketch-accent)]"></div>
                    <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--sketch-paper)] to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--sketch-paper)] to-transparent" />
                    <div
                        className="flex h-full items-center"
                        style={{
                            paddingLeft: `calc(50% - ${ITEM_WIDTH / 2}px)`,
                        }}
                    >
                        <div
                            ref={stripRef}
                            className="flex items-center gap-2"
                            style={{ transform: 'translateX(0px)' }}
                        >
                            {strip.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-shrink-0 items-center justify-center rounded-lg border-2 border-[var(--sketch-ink)] font-bold shadow-md"
                                    style={{
                                        width: `${ITEM_WIDTH - 8}px`,
                                        height: '60px',
                                        backgroundColor: item.color,
                                        color: ['#f4f1de', '#f2cc8f', '#e9c46a', '#a8dadc'].includes(item.color)
                                            ? 'var(--sketch-ink)'
                                            : '#fff',
                                    }}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Spin button */}
                <div className="mt-4 flex justify-center gap-3">
                    <button
                        onClick={spin}
                        disabled={isSpinning || names.length === 0}
                        className="sketch-btn sketch-btn-primary flex items-center gap-2 rounded-lg px-6 py-2 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <PlayIcon className="h-5 w-5" />
                        {isSpinning ? 'Spinning...' : 'SPIN!'}
                    </button>
                    <button
                        onClick={reset}
                        disabled={isSpinning}
                        className="sketch-btn flex items-center gap-2 rounded-lg px-3 py-2 disabled:opacity-50"
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                        Reset
                    </button>
                </div>
            </div>
            <div className="sketch-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold">Names ({names.length})</h2>
                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileImport}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="sketch-btn flex items-center gap-1 rounded-lg px-3 py-1 text-sm"
                            title="Import from Excel"
                        >
                            <ArrowUpTrayIcon className="h-4 w-4" />
                            Import
                        </button>
                        <button
                            onClick={() => setNames([])}
                            className="sketch-btn flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-red-500"
                            disabled={names.length === 0}
                        >
                            <TrashIcon className="h-4 w-4" />
                            Clear
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addName()}
                        placeholder="Enter a name..."
                        className="sketch-input flex-1 rounded-lg text-sm"
                    />
                    <button
                        onClick={addName}
                        className="sketch-btn sketch-btn-soft flex items-center gap-1 rounded-lg px-3 py-1"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Add
                    </button>
                </div>
                <div className="max-h-48 overflow-y-auto">
                    {names.length === 0 ? (
                        <p className="text-center text-sm text-[var(--sketch-pencil)]">No names added yet. Add manually or import from Excel.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {names.map((name, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between rounded-lg border border-[var(--sketch-border)] px-2 py-1.5 text-sm transition-colors hover:bg-[var(--sketch-bg)]"
                                    style={{ borderLeftColor: COLORS[index % COLORS.length], borderLeftWidth: '3px' }}
                                >
                                    <span className="truncate flex-1" title={name}>{name}</span>
                                    <button
                                        onClick={() => removeName(index)}
                                        className="text-[var(--sketch-pencil)] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity ml-1"
                                        disabled={isSpinning}
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
