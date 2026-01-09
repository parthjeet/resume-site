import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ProjectsScreen } from './ProjectsScreen';
import { projects } from '@/data/content';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
  ArrowRight: () => <svg data-testid="icon-arrow" />,
  Search: () => <svg data-testid="icon-search" />,
  ExternalLink: () => <svg data-testid="icon-external" />,
  Github: () => <svg data-testid="icon-github" />,
  FileText: () => <svg data-testid="icon-file" />,
  Monitor: () => <svg data-testid="icon-monitor" />,
  BookOpen: () => <svg data-testid="icon-book" />,
}));

describe('ProjectsScreen', () => {
  it('should render the address bar with the correct path', () => {
    render(<ProjectsScreen />);
    expect(screen.getByText('C:\\Users\\DevOps\\Documents\\Projects')).toBeInTheDocument();
  });

  it('should render all project cards', () => {
    render(<ProjectsScreen />);
    const projectCards = screen.getAllByRole('link'); // CTA is a link
    expect(projectCards).toHaveLength(projects.length);
  });

  it('should display filename, title, and description for each project', () => {
    render(<ProjectsScreen />);
    projects.forEach(project => {
      // Find the card container. A bit tricky without a specific test-id.
      // Let's find by title, and then check within its container.
      const projectTitle = screen.getByText(project.title);
      const card = projectTitle.closest('.project-card');
      expect(card).not.toBeNull();

      if (card) {
        expect(within(card).getByText(project.filename)).toBeInTheDocument();
        expect(within(card).getByText(project.description)).toBeInTheDocument();
      }
    });
  });

  it('should render technology tags for each project', () => {
    render(<ProjectsScreen />);
    projects.forEach(project => {
      const projectTitle = screen.getByText(project.title);
      const card = projectTitle.closest('.project-card');
      expect(card).not.toBeNull();

      if (card) {
        project.technologies.forEach(tech => {
          expect(within(card).getByText(tech)).toBeInTheDocument();
        });
      }
    });
  });

  it('should render the correct CTA icon for each project', () => {
    render(<ProjectsScreen />);
    projects.forEach(project => {
      const projectTitle = screen.getByText(project.title);
      const card = projectTitle.closest('.project-card');
      expect(card).not.toBeNull();

      if (card) {
        const ctaLink = within(card).getByRole('link', { name: new RegExp(project.cta.text, 'i') });
        expect(ctaLink).toBeInTheDocument();
        const icon = within(card).getByTestId(`icon-${project.cta.icon}`);
        expect(icon).toBeInTheDocument();
      }
    });
  });

  it('should apply a thumbnail gradient style to each project card', () => {
    render(<ProjectsScreen />);
    projects.forEach(project => {
      const projectTitle = screen.getByText(project.title);
      const card = projectTitle.closest('.project-card');
      expect(card).not.toBeNull();

      if (card) {
        const thumbnail = card.querySelector('.bg-gradient-to-br');
        expect(thumbnail).toBeInTheDocument();
      }
    });
  });

  it('should have the correct href and text for each CTA link', () => {
    render(<ProjectsScreen />);
    projects.forEach(project => {
      const projectTitle = screen.getByText(project.title);
      const card = projectTitle.closest('.project-card');
      expect(card).not.toBeNull();

      if (card) {
        const ctaLink = within(card).getByRole('link');
        expect(ctaLink).toHaveAttribute('href', project.cta.url);
        expect(ctaLink).toHaveTextContent(new RegExp(project.cta.text, 'i'));
      }
    });
  });

  it('should render the correct number of projects', () => {
    render(<ProjectsScreen />);
    const projectCards = screen.getAllByRole('link');
    expect(projectCards).toHaveLength(6);
  });

  it('should split projects correctly between the two rows', () => {
    const { container } = render(<ProjectsScreen />);
    const rows = container.querySelectorAll('.grid');
    expect(rows).toHaveLength(2);

    const firstRow = rows[0];
    const secondRow = rows[1];

    expect(firstRow.children).toHaveLength(3);
    expect(secondRow.children).toHaveLength(3);
  });
});
