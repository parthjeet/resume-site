import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from './use-toast';

describe('useToast', () => {
  beforeEach(() => {
    // Since memoryState is global to the module, we try to dismiss all toasts before each test
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
  });

  it('should initialize with an empty toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({
        title: 'Test Toast',
        description: 'This is a test',
      });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      description: 'This is a test',
      open: true,
    });
  });

  it('should update a toast', () => {
    const { result } = renderHook(() => useToast());
    let toastObj: any;

    act(() => {
      toastObj = toast({
        title: 'Initial Title',
      });
    });

    act(() => {
      toastObj.update({
        id: toastObj.id,
        title: 'Updated Title',
      });
    });

    expect(result.current.toasts[0].title).toBe('Updated Title');
  });

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast());
    let toastObj: any;

    act(() => {
      toastObj = toast({
        title: 'To Dismiss',
      });
    });

    expect(result.current.toasts[0].open).toBe(true);

    act(() => {
      toastObj.dismiss();
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should limit the number of toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
    });

    // TOAST_LIMIT is 1 in the implementation
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Toast 2');
  });

  it('should dismiss all toasts when calling dismiss() without id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Toast 1' });
    });

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.toasts.every(t => t.open === false)).toBe(true);
  });
});
