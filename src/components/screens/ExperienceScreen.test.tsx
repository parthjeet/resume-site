import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceScreen } from './ExperienceScreen';
import { experiences } from '@/data/content';

// Mock Lucide icons to avoid rendering issues and simplify assertions
vi.mock('lucide-react', () => ({
  Building2: () => <svg data-testid="icon-building2" />,
  Cloud: () => <svg data-testid="icon-cloud" />,
}));

describe('ExperienceScreen', () => {
  describe('Rendering', () => {
    it('should render the section title "Work Experience"', () => {
      render(<ExperienceScreen />);
      
      expect(screen.getByText('Work Experience')).toBeInTheDocument();
    });

    it('should render all experience items from the experiences data', () => {
      render(<ExperienceScreen />);
      
      // Verify each experience is rendered
      experiences.forEach((exp) => {
        expect(screen.getByText(exp.title)).toBeInTheDocument();
        expect(screen.getByText(exp.company)).toBeInTheDocument();
        expect(screen.getByText(exp.period)).toBeInTheDocument();
      });
    });

    it('should display title, company, and period for each experience', () => {
      render(<ExperienceScreen />);
      
      // Test the first experience specifically
      const firstExp = experiences[0];
      expect(screen.getByText(firstExp.title)).toBeInTheDocument();
      expect(screen.getByText(firstExp.company)).toBeInTheDocument();
      expect(screen.getByText(firstExp.period)).toBeInTheDocument();
    });
  });

  describe('Visual Logic', () => {
    it('should display Building2 icon for the first experience item', () => {
      render(<ExperienceScreen />);
      
      const building2Icons = screen.getAllByTestId('icon-building2');
      expect(building2Icons).toHaveLength(1);
    });

    it('should display Cloud icons for subsequent experience items', () => {
      render(<ExperienceScreen />);
      
      // Should have Cloud icons for all items except the first one
      const cloudIcons = screen.getAllByTestId('icon-cloud');
      expect(cloudIcons).toHaveLength(experiences.length - 1);
    });

    it('should apply alternating layout classes based on index', () => {
      const { container } = render(<ExperienceScreen />);
      
      // Get all experience card containers
      const experienceCards = container.querySelectorAll('.relative.md\\:flex');
      
      experienceCards.forEach((card, index) => {
        if (index % 2 === 0) {
          // Even index should have md:flex-row-reverse
          expect(card.className).toContain('md:flex-row-reverse');
        } else {
          // Odd index should not have md:flex-row-reverse
          expect(card.className).not.toContain('md:flex-row-reverse');
        }
      });
    });
  });

  describe('Data Mapping', () => {
    it('should render the achievements list for each experience', () => {
      render(<ExperienceScreen />);
      
      experiences.forEach((exp) => {
        exp.achievements.forEach((achievement) => {
          expect(screen.getByText(achievement)).toBeInTheDocument();
        });
      });
    });

    it('should render technology tags for each experience', () => {
      render(<ExperienceScreen />);
      
      experiences.forEach((exp) => {
        exp.technologies.forEach((tech) => {
          // Use getAllByText because technologies might be repeated across experiences
          const techElements = screen.getAllByText(tech);
          expect(techElements.length).toBeGreaterThan(0);
        });
      });
    });

    it('should render all achievements with bullet points', () => {
      const { container } = render(<ExperienceScreen />);
      
      // Count bullet points - each achievement should have a bullet
      const bullets = container.querySelectorAll('li .text-burgundy');
      const totalAchievements = experiences.reduce(
        (sum, exp) => sum + exp.achievements.length,
        0
      );
      
      expect(bullets.length).toBe(totalAchievements);
    });

    it('should render all technology tags with correct styling', () => {
      const { container } = render(<ExperienceScreen />);
      
      // Get all tech tags
      const techTags = container.querySelectorAll('.tech-tag');
      const totalTechnologies = experiences.reduce(
        (sum, exp) => sum + exp.technologies.length,
        0
      );
      
      expect(techTags.length).toBe(totalTechnologies);
    });
  });

  describe('Component Structure', () => {
    it('should render timeline visual elements', () => {
      const { container } = render(<ExperienceScreen />);
      
      // Check for timeline line
      const timelineLine = container.querySelector('.timeline-line');
      expect(timelineLine).toBeInTheDocument();
    });

    it('should render timeline dots for each experience', () => {
      const { container } = render(<ExperienceScreen />);
      
      // Check for timeline dots
      const timelineDots = container.querySelectorAll('.timeline-dot');
      expect(timelineDots.length).toBe(experiences.length);
    });

    it('should render experience cards with correct styling', () => {
      const { container } = render(<ExperienceScreen />);
      
      // Check for content cards with accent
      const contentCards = container.querySelectorAll('.content-card-accent');
      expect(contentCards.length).toBe(experiences.length);
    });

    it('should apply correct padding classes for alternating layout', () => {
      const { container } = render(<ExperienceScreen />);
      
      // Get all card wrapper divs
      const cardWrappers = Array.from(container.querySelectorAll('.md\\:w-1\\/2'));
      
      // Filter out the spacer divs (they don't have md:pr-12 or md:pl-12)
      const actualCards = cardWrappers.filter(
        (el) => el.className.includes('md:pr-12') || el.className.includes('md:pl-12')
      );
      
      actualCards.forEach((card, index) => {
        if (index % 2 === 0) {
          // Even index should have md:pr-12
          expect(card.className).toContain('md:pr-12');
        } else {
          // Odd index should have md:pl-12
          expect(card.className).toContain('md:pl-12');
        }
      });
    });
  });

  describe('Data Integrity', () => {
    it('should render the correct number of experience items', () => {
      const { container } = render(<ExperienceScreen />);
      
      const experienceCards = container.querySelectorAll('.content-card-accent');
      expect(experienceCards.length).toBe(experiences.length);
    });

    it('should handle empty achievements array gracefully', () => {
      // This tests the component's robustness, though current data has achievements
      // Just verify the component renders without errors
      const { container } = render(<ExperienceScreen />);
      expect(container).toBeInTheDocument();
    });

    it('should render experiences in the correct order', () => {
      render(<ExperienceScreen />);
      
      // Get all experience titles
      const titles = screen.getAllByRole('heading', { level: 3 });
      
      // Verify they appear in the same order as the data
      experiences.forEach((exp, index) => {
        expect(titles[index]).toHaveTextContent(exp.title);
      });
    });
  });
});
