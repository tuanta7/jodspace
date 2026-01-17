import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
    PencilIcon,
    TrashIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    ArrowDownTrayIcon,
    SwatchIcon,
    MinusIcon,
    MagnifyingGlassPlusIcon,
    MagnifyingGlassMinusIcon,
    ArrowsPointingOutIcon,
    HandRaisedIcon,
} from '@heroicons/react/24/outline';

export const Route = createFileRoute('/board/whiteboard')({
    component: WhiteboardPage,
});

type Tool = 'pen' | 'eraser' | 'pan';

interface Point {
    x: number;
    y: number;
}

interface DrawAction {
    tool: Tool;
    color: string;
    lineWidth: number;
    points: Point[]; // These are world coordinates
}

interface Viewport {
    x: number; // Pan offset X (world coordinates)
    y: number; // Pan offset Y (world coordinates)
    scale: number; // Zoom level
}

const COLORS = [
    '#3d3a36', // ink (black)
    '#e07a5f', // accent (red-orange)
    '#81b29a', // soft (green)
    '#3d405b', // dark blue
    '#f2cc8f', // highlight (yellow)
    '#e76f51', // coral
    '#2a9d8f', // teal
    '#9c89b8', // purple
];

const BRUSH_SIZES = [2, 4, 8, 12, 20];
const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_SENSITIVITY = 0.001;

function WhiteboardPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [tool, setTool] = useState<Tool>('pen');
    const [color, setColor] = useState(COLORS[0]);
    const [lineWidth, setLineWidth] = useState(4);
    const [history, setHistory] = useState<DrawAction[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 1 });
    const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);

    // Convert screen coordinates to world coordinates
    const screenToWorld = useCallback((screenX: number, screenY: number): Point => {
        return {
            x: (screenX / viewport.scale) + viewport.x,
            y: (screenY / viewport.scale) + viewport.y,
        };
    }, [viewport]);

    // Convert world coordinates to screen coordinates
    const worldToScreen = useCallback((worldX: number, worldY: number): Point => {
        return {
            x: (worldX - viewport.x) * viewport.scale,
            y: (worldY - viewport.y) * viewport.scale,
        };
    }, [viewport]);

    // Initialize canvas with proper size
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    // Redraw canvas whenever history, historyIndex, or viewport changes
    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Fill with paper background
        ctx.fillStyle = '#fffef9';
        ctx.fillRect(0, 0, width, height);

        // Draw grid for infinite canvas effect
        drawGrid(ctx, width, height);

        // Draw all actions up to current history index
        const actionsToDraw = history.slice(0, historyIndex + 1);
        actionsToDraw.forEach((action) => {
            drawAction(ctx, action);
        });

        // Draw current action being drawn
        if (currentAction && currentAction.points.length > 1) {
            drawAction(ctx, currentAction);
        }
    }, [history, historyIndex, viewport, currentAction]);

    // Draw grid pattern for infinite canvas visualization
    const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const gridSize = 50;
        const scaledGridSize = gridSize * viewport.scale;

        // Only draw grid if it's visible (not too zoomed out)
        if (scaledGridSize < 10) return;

        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 1;

        // Calculate grid offset based on viewport
        const offsetX = (-viewport.x * viewport.scale) % scaledGridSize;
        const offsetY = (-viewport.y * viewport.scale) % scaledGridSize;

        ctx.beginPath();

        // Vertical lines
        for (let x = offsetX; x < width; x += scaledGridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        // Horizontal lines
        for (let y = offsetY; y < height; y += scaledGridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }

        ctx.stroke();
    }, [viewport, worldToScreen]);

    useEffect(() => {
        redrawCanvas();
    }, [redrawCanvas]);

    const drawAction = useCallback((ctx: CanvasRenderingContext2D, action: DrawAction) => {
        if (action.points.length < 2) return;
        if (action.tool === 'pan') return; // Don't draw pan actions

        ctx.beginPath();
        ctx.strokeStyle = action.tool === 'eraser' ? '#fffef9' : action.color;
        ctx.lineWidth = (action.tool === 'eraser' ? action.lineWidth * 3 : action.lineWidth) * viewport.scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Convert first point to screen coordinates
        const firstPoint = worldToScreen(action.points[0].x, action.points[0].y);
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for (let i = 1; i < action.points.length; i++) {
            const point = worldToScreen(action.points[i].x, action.points[i].y);
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }, [viewport, worldToScreen]);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        let clientX: number, clientY: number;
        if ('touches' in e) {
            if (e.touches.length === 0) return null;
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const screenX = clientX - rect.left;
        const screenY = clientY - rect.top;

        // Return world coordinates
        return screenToWorld(screenX, screenY);
    };

    const getScreenCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        let clientX: number, clientY: number;
        if ('touches' in e) {
            if (e.touches.length === 0) return null;
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (tool === 'pan') {
            const screenPoint = getScreenCoordinates(e);
            if (!screenPoint) return;
            setIsPanning(true);
            setLastPanPoint(screenPoint);
            return;
        }

        const point = getCoordinates(e);
        if (!point) return;

        setIsDrawing(true);
        setCurrentAction({
            tool,
            color,
            lineWidth,
            points: [point],
        });
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (isPanning && tool === 'pan') {
            const screenPoint = getScreenCoordinates(e);
            if (!screenPoint || !lastPanPoint) return;

            const dx = (screenPoint.x - lastPanPoint.x) / viewport.scale;
            const dy = (screenPoint.y - lastPanPoint.y) / viewport.scale;

            setViewport(prev => ({
                ...prev,
                x: prev.x - dx,
                y: prev.y - dy,
            }));
            setLastPanPoint(screenPoint);
            return;
        }

        if (!isDrawing || !currentAction) return;

        const point = getCoordinates(e);
        if (!point) return;

        const newAction = {
            ...currentAction,
            points: [...currentAction.points, point],
        };
        setCurrentAction(newAction);
    };

    const stopDrawing = () => {
        if (isPanning) {
            setIsPanning(false);
            setLastPanPoint(null);
            return;
        }

        if (!isDrawing || !currentAction) return;

        if (currentAction.points.length > 1) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(currentAction);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }

        setIsDrawing(false);
        setCurrentAction(null);
    };

    // Handle mouse wheel for zooming
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Get world position under mouse before zoom
        const worldBefore = screenToWorld(mouseX, mouseY);

        // Calculate new scale
        const delta = -e.deltaY * ZOOM_SENSITIVITY;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, viewport.scale * (1 + delta)));

        // Calculate new viewport position to keep mouse position fixed
        const newViewport = {
            scale: newScale,
            x: worldBefore.x - (mouseX / newScale),
            y: worldBefore.y - (mouseY / newScale),
        };

        setViewport(newViewport);
    }, [viewport, screenToWorld]);

    const zoomIn = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const worldCenter = screenToWorld(centerX, centerY);
        const newScale = Math.min(MAX_SCALE, viewport.scale * 1.2);

        setViewport({
            scale: newScale,
            x: worldCenter.x - (centerX / newScale),
            y: worldCenter.y - (centerY / newScale),
        });
    };

    const zoomOut = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const worldCenter = screenToWorld(centerX, centerY);
        const newScale = Math.max(MIN_SCALE, viewport.scale / 1.2);

        setViewport({
            scale: newScale,
            x: worldCenter.x - (centerX / newScale),
            y: worldCenter.y - (centerY / newScale),
        });
    };

    const resetView = () => {
        setViewport({ x: 0, y: 0, scale: 1 });
    };

    const undo = () => {
        if (historyIndex >= 0) {
            setHistoryIndex(historyIndex - 1);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
        }
    };

    const clearCanvas = () => {
        setHistory([]);
        setHistoryIndex(-1);
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create a temporary canvas with all content at scale 1
        const tempCanvas = document.createElement('canvas');
        const padding = 50;

        // Find bounds of all drawings
        const allPoints = history.slice(0, historyIndex + 1).flatMap(a => a.points);
        if (allPoints.length === 0) {
            // Export current view if no drawings
            const link = document.createElement('a');
            link.download = `whiteboard-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            return;
        }

        const minX = Math.min(...allPoints.map(p => p.x)) - padding;
        const maxX = Math.max(...allPoints.map(p => p.x)) + padding;
        const minY = Math.min(...allPoints.map(p => p.y)) - padding;
        const maxY = Math.max(...allPoints.map(p => p.y)) + padding;

        tempCanvas.width = maxX - minX;
        tempCanvas.height = maxY - minY;

        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Fill background
        tempCtx.fillStyle = '#fffef9';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw all actions
        history.slice(0, historyIndex + 1).forEach(action => {
            if (action.points.length < 2 || action.tool === 'pan') return;

            tempCtx.beginPath();
            tempCtx.strokeStyle = action.tool === 'eraser' ? '#fffef9' : action.color;
            tempCtx.lineWidth = action.tool === 'eraser' ? action.lineWidth * 3 : action.lineWidth;
            tempCtx.lineCap = 'round';
            tempCtx.lineJoin = 'round';

            tempCtx.moveTo(action.points[0].x - minX, action.points[0].y - minY);
            for (let i = 1; i < action.points.length; i++) {
                tempCtx.lineTo(action.points[i].x - minX, action.points[i].y - minY);
            }
            tempCtx.stroke();
        });

        const link = document.createElement('a');
        link.download = `whiteboard-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    };

    // Determine cursor style
    const getCursor = () => {
        if (tool === 'pan') return isPanning ? 'grabbing' : 'grab';
        return 'crosshair';
    };

    return (
        <div className="flex h-full flex-col gap-3 px-2 sm:px-4">
            {/* Toolbar */}
            <div className="sketch-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-3">
                {/* Tools */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTool('pen')}
                        className={`sketch-btn flex items-center gap-1 rounded-lg px-3 py-2 ${
                            tool === 'pen' ? 'sketch-btn-primary' : ''
                        }`}
                        title="Pen"
                    >
                        <PencilIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Pen</span>
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={`sketch-btn flex items-center gap-1 rounded-lg px-3 py-2 ${
                            tool === 'eraser' ? 'sketch-btn-primary' : ''
                        }`}
                        title="Eraser"
                    >
                        <MinusIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Eraser</span>
                    </button>
                    <button
                        onClick={() => setTool('pan')}
                        className={`sketch-btn flex items-center gap-1 rounded-lg px-3 py-2 ${
                            tool === 'pan' ? 'sketch-btn-primary' : ''
                        }`}
                        title="Pan (drag to move)"
                    >
                        <HandRaisedIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Pan</span>
                    </button>
                </div>

                {/* Color Picker */}
                <div className="relative">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="sketch-btn flex items-center gap-2 rounded-lg px-3 py-2"
                        title="Color"
                    >
                        <div
                            className="h-5 w-5 rounded-full border-2 border-[var(--sketch-ink)]"
                            style={{ backgroundColor: color }}
                        />
                        <SwatchIcon className="h-5 w-5" />
                    </button>
                    {showColorPicker && (
                        <div className="absolute left-0 top-full z-20 mt-2 grid grid-cols-4 gap-2 rounded-xl border-2 border-[var(--sketch-ink)] bg-[var(--sketch-paper)] p-3 shadow-lg">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => {
                                        setColor(c);
                                        setShowColorPicker(false);
                                    }}
                                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                        color === c
                                            ? 'border-[var(--sketch-accent)] ring-2 ring-[var(--sketch-accent)]'
                                            : 'border-[var(--sketch-ink)]'
                                    }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Brush Size */}
                <div className="flex items-center gap-1">
                    {BRUSH_SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => setLineWidth(size)}
                            className={`sketch-btn flex h-10 w-10 items-center justify-center rounded-lg p-0 ${
                                lineWidth === size ? 'sketch-btn-soft' : ''
                            }`}
                            title={`Size ${size}px`}
                        >
                            <div
                                className="rounded-full bg-[var(--sketch-ink)]"
                                style={{
                                    width: Math.min(size + 4, 20),
                                    height: Math.min(size + 4, 20),
                                }}
                            />
                        </button>
                    ))}
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={zoomOut}
                        className="sketch-btn rounded-lg px-2 py-2"
                        title="Zoom Out"
                    >
                        <MagnifyingGlassMinusIcon className="h-5 w-5" />
                    </button>
                    <span className="min-w-[60px] text-center text-sm font-medium">
                        {Math.round(viewport.scale * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        className="sketch-btn rounded-lg px-2 py-2"
                        title="Zoom In"
                    >
                        <MagnifyingGlassPlusIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={resetView}
                        className="sketch-btn rounded-lg px-2 py-2"
                        title="Reset View"
                    >
                        <ArrowsPointingOutIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={undo}
                        disabled={historyIndex < 0}
                        className="sketch-btn rounded-lg px-3 py-2 disabled:opacity-40"
                        title="Undo"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="sketch-btn rounded-lg px-3 py-2 disabled:opacity-40"
                        title="Redo"
                    >
                        <ArrowUturnRightIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="sketch-btn rounded-lg px-3 py-2 text-[var(--sketch-accent)]"
                        title="Clear All"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={downloadCanvas}
                        className="sketch-btn sketch-btn-soft rounded-lg px-3 py-2"
                        title="Download"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div
                ref={containerRef}
                className="sketch-card relative flex-1 overflow-hidden rounded-xl"
                style={{ cursor: getCursor() }}
                onClick={() => setShowColorPicker(false)}
            >
                <canvas
                    ref={canvasRef}
                    className="touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onWheel={handleWheel}
                />

                {/* Canvas hint overlay - shows when empty */}
                {history.length === 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-[var(--sketch-pencil)] opacity-50">
                            <PencilIcon className="mx-auto h-16 w-16" />
                            <p className="mt-2 text-xl">Start drawing!</p>
                            <p className="text-sm">Scroll to zoom • Use Pan tool to move</p>
                        </div>
                    </div>
                )}

                {/* Mini map / position indicator */}
                <div className="absolute bottom-3 left-3 rounded-lg bg-[var(--sketch-paper)]/90 px-2 py-1 text-xs text-[var(--sketch-pencil)] shadow">
                    X: {Math.round(viewport.x)} Y: {Math.round(viewport.y)}
                </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between text-sm text-[var(--sketch-pencil)]">
                <span>
                    Tool: <strong>{tool === 'pen' ? 'Pen' : tool === 'eraser' ? 'Eraser' : 'Pan'}</strong> | Size:{' '}
                    <strong>{lineWidth}px</strong> | Zoom: <strong>{Math.round(viewport.scale * 100)}%</strong>
                </span>
                <span>
                    History: {historyIndex + 1} / {history.length} strokes
                </span>
            </div>
        </div>
    );
}
