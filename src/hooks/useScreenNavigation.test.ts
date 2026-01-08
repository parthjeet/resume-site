import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScreenNavigation } from './useScreenNavigation';

describe('useScreenNavigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default screen', () => {
    const { result } = renderHook(() => useScreenNavigation());
    expect(result.current.currentScreen).toBe('about');
    expect(result.current.currentIndex).toBe(0);
  });

  it('should initialize with custom initial screen', () => {
    const { result } = renderHook(() => useScreenNavigation('skills'));
    expect(result.current.currentScreen).toBe('skills');
    expect(result.current.currentIndex).toBe(2);
  });

  it('should navigate to a different screen', () => {
    const { result } = renderHook(() => useScreenNavigation());

    act(() => {
      result.current.goToScreen('experience');
    });

    expect(result.current.currentScreen).toBe('experience');
    expect(result.current.isTransitioning).toBe(true);
  });

  it('should set transition direction to forward when navigating to later screen', () => {
    const { result } = renderHook(() => useScreenNavigation());

    act(() => {
      result.current.goToScreen('skills');
    });

    expect(result.current.transitionDirection).toBe('forward');
  });

  it('should set transition direction to backward when navigating to earlier screen', () => {
    const { result } = renderHook(() => useScreenNavigation('skills'));

    act(() => {
      result.current.goToScreen('about');
    });

    expect(result.current.transitionDirection).toBe('backward');
  });

  it('should clear transitioning state after duration', () => {
    const { result } = renderHook(() => useScreenNavigation('about', 400));

    act(() => {
      result.current.goToScreen('experience');
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.isTransitioning).toBe(false);
  });

  it('should not navigate to the same screen', () => {
    const { result } = renderHook(() => useScreenNavigation());

    act(() => {
      result.current.goToScreen('about');
    });

    expect(result.current.isTransitioning).toBe(false);
  });

  it('should not navigate while transitioning', () => {
    const { result } = renderHook(() => useScreenNavigation());

    act(() => {
      result.current.goToScreen('experience');
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      result.current.goToScreen('skills');
    });

    // Should still be on experience, not skills
    expect(result.current.currentScreen).toBe('experience');
  });

  describe('goNext', () => {
    it('should navigate to next screen', () => {
      const { result } = renderHook(() => useScreenNavigation());

      act(() => {
        result.current.goNext();
      });

      expect(result.current.currentScreen).toBe('experience');
    });

    it('should not navigate past last screen', () => {
      const { result } = renderHook(() => useScreenNavigation('education'));

      act(() => {
        result.current.goNext();
      });

      expect(result.current.currentScreen).toBe('education');
    });
  });

  describe('goPrevious', () => {
    it('should navigate to previous screen', () => {
      const { result } = renderHook(() => useScreenNavigation('experience'));

      act(() => {
        result.current.goPrevious();
      });

      expect(result.current.currentScreen).toBe('about');
    });

    it('should not navigate before first screen', () => {
      const { result } = renderHook(() => useScreenNavigation());

      act(() => {
        result.current.goPrevious();
      });

      expect(result.current.currentScreen).toBe('about');
    });
  });

  describe('getWindowTitle', () => {
    it('should return window title for current screen', () => {
      const { result } = renderHook(() => useScreenNavigation());
      expect(result.current.getWindowTitle()).toBe('ALEX_CHEN_PORTFOLIO.EXE');
    });

    it('should return experience window title', () => {
      const { result } = renderHook(() => useScreenNavigation('experience'));
      expect(result.current.getWindowTitle()).toBe('EXPERIENCE_LOG.TXT');
    });
  });
});
