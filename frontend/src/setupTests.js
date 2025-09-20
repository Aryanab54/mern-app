import '@testing-library/jest-dom';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock axios with proper return values
jest.mock('axios', () => ({
  create: () => ({
    interceptors: {
      request: { use: jest.fn() },
    },
    post: jest.fn(() => Promise.resolve({ 
      data: { 
        token: 'mock-token', 
        user: { id: '1', email: 'admin@test.com' } 
      } 
    })),
    get: jest.fn(() => Promise.resolve({ 
      data: [
        { _id: '1', name: 'John Doe', email: 'john@test.com', mobile: '+1234567890' }
      ] 
    })),
  }),
}));