import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { WindowContainer } from './WindowContainer';

describe('WindowContainer', () => {
  it('should render the title correctly', () => {
    render(
      <WindowContainer title="Test Title" isTransitioning={false}>
        <div>Test Content</div>
      </WindowContainer>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <WindowContainer title="Test Title" isTransitioning={false}>
        <div data-testid="test-content">Test Content</div>
      </WindowContainer>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should handle title changes with flickering effect', () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <WindowContainer title="Initial Title" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );

    expect(screen.getByText('Initial Title')).toBeInTheDocument();

    rerender(
      <WindowContainer title="Updated Title" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );

    // Should still show Initial Title immediately because of the 200ms delay in useEffect
    expect(screen.getByText('Initial Title')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText('Updated Title')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('should render the correct icon', () => {
    const { container } = render(
      <WindowContainer title="Icon Test" icon="building" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );
    
    // Check if the building icon is rendered
    // Lucide icons often have class lucide-building2 for Building2
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('lucide-building2');
  });
});
