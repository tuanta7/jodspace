function Footer() {
    return (
        <footer className="mx-4 mb-4 mt-8 text-center">
            <p className="text-sm text-[var(--sketch-pencil)]">
                <span className="sketch-underline text-md font-semibold tracking-tight">JODSPACE</span> ©{' '}
                {new Date().getFullYear()}
            </p>
        </footer>
    );
}

export default Footer;
