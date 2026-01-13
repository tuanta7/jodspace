function Footer() {
    return (
        <footer className="mx-4 mb-4 mt-8 text-center">
            <div className="sketch-divider mb-3">
                <span>~</span>
            </div>
            <p className="text-[var(--sketch-pencil)] text-sm">
                Made with 💛 • JODSPACE © {new Date().getFullYear()}
            </p>
            <p className="mt-1 text-xs text-[var(--sketch-border)]">
                ✏️ Sketch your ideas
            </p>
        </footer>
    );
}

export default Footer;
