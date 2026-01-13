function SpaceList() {
    return (
        <div className="sketch-card p-6">
            <div className="sketch-header flex items-center justify-between">
                <h2 className="text-xl font-semibold">📌 Pinned Spaces</h2>
                <span className="sketch-tag">3 items</span>
            </div>
            <div className="mt-4 grid gap-3">
                <div className="rounded border-l-4 border-[var(--sketch-accent)] bg-[var(--sketch-paper)] p-3">
                    <div>
                        <p className="font-medium">Project Ideas</p>
                        <p className="text-sm text-[var(--sketch-pencil)]">Brainstorm session notes from Monday</p>
                    </div>
                </div>
                <div className="rounded border-l-4 border-[var(--sketch-soft)] bg-[var(--sketch-paper)] p-3">
                    <div>
                        <p className="font-medium">Reading List</p>
                        <p className="text-sm text-[var(--sketch-pencil)]">Books to check out this month</p>
                    </div>
                </div>
                <div className="rounded border-l-4 border-[var(--sketch-highlight)] bg-[var(--sketch-paper)] p-3">
                    <div>
                        <p className="font-medium">Goals 2026</p>
                        <p className="text-sm text-[var(--sketch-pencil)]">Yearly objectives and key results</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpaceList