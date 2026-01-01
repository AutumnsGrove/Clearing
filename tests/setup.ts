import { vi } from 'vitest';

// Mock Cloudflare Workers environment
const mockEnv = {
	DB: {
		prepare: vi.fn().mockReturnThis(),
		bind: vi.fn().mockReturnThis(),
		first: vi.fn(),
		all: vi.fn(),
		run: vi.fn()
	}
};

// Mock fetch
global.fetch = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
	vi.clearAllMocks();
});

export { mockEnv };