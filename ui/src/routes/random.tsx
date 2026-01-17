import { createFileRoute } from '@tanstack/react-router';
import { Fragment, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { PlusIcon, TrashIcon, PlayIcon, ArrowPathIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import * as React from 'react';

export const Route = createFileRoute('/random')({
    component: RandomWheel,
});

const ITEM_WIDTH = 160;

const COLORS = [
    '#4b69ff', // Mil-Spec (Rare)
    '#8847ff', // Restricted (Mythical):
    '#d32ce6', // Classified (Legendary)
    '#eb4b4b', // Covert (Ancient):
    '#ffd700', // Exceedingly Rare (Special/Knives/Gloves)
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
                    color: COLORS[(Math.floor(Math.random() * 3) + names.length + idx) % COLORS.length],
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

        // Calculate final position
        const winnerIndex = Math.floor(Math.random() * names.length);
        const spinsBeforeStop = 5 + Math.floor(Math.random() * 3);
        const itemsToSpin = spinsBeforeStop * names.length + winnerIndex;

        // random offset within the item width
        const randomOffset = (Math.random() - 0.5) * (ITEM_WIDTH * 0.8);
        const finalOffset = itemsToSpin * ITEM_WIDTH + randomOffset;

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
        reader.readAsArrayBuffer(file);

        if (fileInputRef.current) {
            // Reset input so same file can be selected again
            fileInputRef.current.value = '';
        }
    };

    return (
        <Fragment>
            <Helmet>
                <title>Random Name Picker - CSGO Style Wheel | JODSPACE</title>
                <meta name="description" content="Fun CSGO case opening style random name picker. Perfect for choosing winners, making decisions, or picking team members. Import from Excel supported!" />
                <meta name="keywords" content="random picker, name wheel, CSGO style, random selector, team picker, winner picker" />
                <meta property="og:title" content="Random Name Picker - CSGO Style Wheel | JODSPACE" />
                <meta property="og:description" content="Fun CSGO case opening style random name picker. Perfect for choosing winners!" />
            </Helmet>

            {showModal && winner && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    {[...Array(60)].map((_, i) => {
                        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#a8d8ea', '#ffd700', '#ff9ff3'];
                        const size = 8 + Math.random() * 10;
                        const isRect = Math.random() > 0.2;
                        return (
                            <div
                                key={`fall-${i}`}
                                className="animate-confetti-fall absolute"
                                style={
                                    {
                                        left: `${Math.random() * 100}%`,
                                        top: '-20px',
                                        width: isRect ? `${size}px` : `${size * 0.6}px`,
                                        height: isRect ? `${size * 0.6}px` : `${size}px`,
                                        backgroundColor: colors[i % colors.length],
                                        borderRadius: Math.random() > 0.5 ? '2px' : '50%',
                                        animationDelay: `${Math.random() * 2}s`,
                                        '--r': `${Math.random() * 720}deg`,
                                        '--duration': `${2 + Math.random() * 2}s`,
                                    } as React.CSSProperties
                                }
                            />
                        );
                    })}
                    <div
                        className="relative z-10 w-full max-w-md rounded-xl border-2 border-[var(--sketch-ink)] bg-[var(--sketch-paper)] p-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex gap-6 justify-between items-center">
                            <div className="px-3">
                                <h2 className="text-lg text-[var(--sketch-pencil)]">The winner is...</h2>
                                <div className="text-3xl font-bold text-[var(--sketch-accent)]">{winner}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="sketch-btn sketch-btn-primary  rounded-lg px-4 py-2"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleRemoveWinner}
                                    className="sketch-btn flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-red-500 hover:bg-red-50"
                                >
                                    Remove Winner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-6xl space-y-4 px-4">
                <div className="sketch-card rounded-xl p-4 text-center">
                    <h1 className="sketch-header text-2xl font-bold">Random Picker</h1>
                    <div className="relative overflow-hidden rounded-lg" style={{ height: '100px' }}>
                        {/*Indicator*/}
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
                                        className="relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-[var(--sketch-ink)] bg-[var(--sketch-paper)] font-bold"
                                        style={{
                                            width: `${ITEM_WIDTH - 8}px`,
                                            height: '60px',
                                            boxShadow: `0 4px 12px -2px ${item.color}70`,
                                        }}
                                    >
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-5"
                                            style={{
                                                background: `linear-gradient(to top, ${item.color}90, ${item.color}40 50%, transparent)`,
                                            }}
                                        />
                                        <span className="relative z-10">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between">
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
                    <div className="mb-4 flex gap-2">
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
                            <p className="text-center text-sm text-[var(--sketch-pencil)]">
                                No names added yet. Add manually or import from Excel.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {names.map((name, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center justify-between rounded-lg border border-[var(--sketch-border)] px-2 py-1.5 text-sm transition-colors hover:bg-[var(--sketch-bg)]"
                                    >
                                        <span className="flex-1 truncate" title={name}>
                                            {name}
                                        </span>
                                        <button
                                            onClick={() => removeName(index)}
                                            className="ml-1 text-[var(--sketch-pencil)] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
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
        </Fragment>
    );
}


