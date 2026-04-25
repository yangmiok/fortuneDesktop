import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  })
});

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock
});

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn()
});

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: () => ({
    getPropertyValue: () => '',
    overflow: 'auto'
  })
});

globalThis.SVGElement = globalThis.SVGElement || class SVGElement {};
