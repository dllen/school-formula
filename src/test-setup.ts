import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// testing-library/react only auto-registers cleanup when the test runner
// exposes globals; vitest here runs with globals disabled, so we wire
// afterEach manually to keep the DOM isolated between cases.
afterEach(() => {
    cleanup();
});
