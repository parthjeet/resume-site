import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { Taskbar } from './Taskbar';
import { screens } from '@/data/content';

describe('Taskbar', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-08T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should render all navigation buttons from screens data', () => {
    render(
      <Taskbar 
        currentScreen="about" 
        onNavigate={mockOnNavigate} 
        isTransitioning={false} 
      />
    );

    screens.forEach(screenData => {
      expect(screen.getByText(screenData.label)).toBeInTheDocument();
    });
  });

  it('should mark the current screen as active', () => {
    render(
      <Taskbar 
        currentScreen="experience" 
        onNavigate={mockOnNavigate} 
        isTransitioning={false} 
      />
    );

    const experienceBtn = screen.getByText('Experience');
    expect(experienceBtn).toHaveClass('active');
    expect(experienceBtn).toHaveAttribute('aria-current', 'page');
  });

  it('should call onNavigate when a button is clicked', () => {
    render(
      <Taskbar 
        currentScreen="about" 
        onNavigate={mockOnNavigate} 
        isTransitioning={false} 
      />
    );

    const skillsBtn = screen.getByText('Skills');
    fireEvent.click(skillsBtn);

    expect(mockOnNavigate).toHaveBeenCalledWith('skills');
  });

  it('should not call onNavigate when transitioning', () => {
    render(
      <Taskbar 
        currentScreen="about" 
        onNavigate={mockOnNavigate} 
        isTransitioning={true} 
      />
    );

    const skillsBtn = screen.getByText('Skills');
    fireEvent.click(skillsBtn);

    expect(mockOnNavigate).not.toHaveBeenCalled();
    expect(skillsBtn).toBeDisabled();
  });

  it('should display the current time correctly', () => {
    render(
      <Taskbar 
        currentScreen="about" 
        onNavigate={mockOnNavigate} 
        isTransitioning={false} 
      />
    );

    expect(screen.getByText('12:00 PM')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(60000); // 1 minute
    });

    expect(screen.getByText('12:01 PM')).toBeInTheDocument();
  });
});
