import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BootSequence } from './BootSequence';

describe('BootSequence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display initializing text initially', () => {
    render(
      <BootSequence onComplete={vi.fn()}>
        <div data-testid="content">Portfolio Content</div>
      </BootSequence>
    );

    expect(screen.getByText(/INITIALIZING PORTFOLIO.SYS/i)).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should call onComplete and show content after delay', () => {
    const onComplete = vi.fn();
    render(
      <BootSequence onComplete={onComplete}>
        <div data-testid="content">Portfolio Content</div>
      </BootSequence>
    );

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByText(/INITIALIZING PORTFOLIO.SYS/i)).not.toBeInTheDocument();
  });
});

// Import act from react if needed, but RTL's render usually handles it.
// Actually, vi.advanceTimersByTime should be wrapped in act if it triggers state updates.
import { act } from 'react';
