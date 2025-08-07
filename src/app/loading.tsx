export default function Loading() {
    return (
        <div
            role="status"
            aria-label="Loading"
            className="flex items-center justify-center min-h-screen bg-[var(--color-white)]"
        >
            <div
                className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-secondary)] border-t-[var(--color-primary)]"
            />
        </div>
    );
}
