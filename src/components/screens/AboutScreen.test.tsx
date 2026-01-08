import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AboutScreen } from './AboutScreen';
import { personalInfo } from '@/data/content';

// Mock Lucide icons to avoid rendering issues and simplify assertions
vi.mock('lucide-react', () => ({
  Settings: () => <svg data-testid="icon-settings" />,
  ArrowRight: () => <svg data-testid="icon-arrow-right" />,
}));

describe('AboutScreen', () => {
  const mockOnNavigate = vi.fn();

  it('should render personal information correctly', () => {
    render(<AboutScreen onNavigate={mockOnNavigate} />);

    expect(screen.getByText(personalInfo.title)).toBeInTheDocument();
    expect(screen.getByText(personalInfo.headline.line1)).toBeInTheDocument();
    expect(screen.getByText(personalInfo.headline.line2)).toBeInTheDocument();
    expect(screen.getByText(personalInfo.bio)).toBeInTheDocument();
  });

  it('should render visual elements', () => {
    render(<AboutScreen onNavigate={mockOnNavigate} />);

    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
    
    // Check for terminal overlay text
    expect(screen.getByText(/ssh root@server/i)).toBeInTheDocument();
    expect(screen.getByText(/System status: ONLINE/i)).toBeInTheDocument();
  });

  it('should handle navigation when CTA button is clicked', () => {
    render(<AboutScreen onNavigate={mockOnNavigate} />);

    const ctaButton = screen.getByRole('button', { name: /view projects/i });
    fireEvent.click(ctaButton);

    expect(mockOnNavigate).toHaveBeenCalledWith('projects');
  });
});
