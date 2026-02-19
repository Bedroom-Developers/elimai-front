import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('zustand')

if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = () => { };
}
if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = () => { };
}
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => { };
}

afterEach(() => {
    cleanup();
});

// Simple noop ResizeObserver polyfill for tests
if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
    class ResizeObserver {
        callback: ResizeObserverCallback;
        constructor(callback: ResizeObserverCallback) {
            this.callback = callback;
        }
        observe() {
            // no-op
        }
        unobserve() {
            // no-op
        }
        disconnect() {
            // no-op
        }
    }

    // @ts-expect-error - jsdom globals
    window.ResizeObserver = ResizeObserver;
    globalThis.ResizeObserver = ResizeObserver;
}
// Mock missing DOM APIs for input-otp
Object.defineProperty(document, 'elementFromPoint', {
    value: vi.fn(() => document.body.firstElementChild || null),
    writable: true,
});
