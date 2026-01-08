import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  let matchMediaMock: ReturnType<typeof vi.fn>;
  let changeHandler: (() => void) | null = null;

  beforeEach(() => {
    changeHandler = null;
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, handler: () => void) => {
        changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
    });
  });

  it('should return false for desktop width', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return true for mobile width', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false at exactly 768px (breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return true at 767px (just below breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 767, writable: true });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should update when window is resized', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current).toBe(true);
  });
});
