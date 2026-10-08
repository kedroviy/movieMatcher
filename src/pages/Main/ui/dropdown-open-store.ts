type OpenDropdownListener = () => void;

let openDropdownId: string | null = null;
const listeners = new Set<OpenDropdownListener>();

export function getOpenDropdownId(): string | null {
    return openDropdownId;
}

export function setOpenDropdownId(id: string | null): void {
    if (openDropdownId === id) {
        return;
    }
    openDropdownId = id;
    listeners.forEach((listener) => listener());
}

export function subscribeOpenDropdown(listener: OpenDropdownListener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
