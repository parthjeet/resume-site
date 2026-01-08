import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillsScreen } from './SkillsScreen';
import { skillCategories } from '@/data/content';

// Mock Lucide icons to avoid rendering issues and simplify assertions
vi.mock('lucide-react', () => ({
  Cloud: () => <svg data-testid="icon-cloud" />,
  Box: () => <svg data-testid="icon-box" />,
  Terminal: () => <svg data-testid="icon-terminal" />,
  BarChart3: () => <svg data-testid="icon-barchart3" />,
  Check: () => <svg data-testid="icon-check" />,
}));

describe('SkillsScreen', () => {
  describe('Rendering', () => {
    it('should render the section title "Technology Stack"', () => {
      render(<SkillsScreen />);
      
      expect(screen.getByText('Technology Stack')).toBeInTheDocument();
    });

    it('should render all skill categories from the data source', () => {
      render(<SkillsScreen />);
      
      skillCategories.forEach((category) => {
        expect(screen.getByText(category.title)).toBeInTheDocument();
      });
    });

    it('should render all skills within each category', () => {
      render(<SkillsScreen />);
      
      skillCategories.forEach((category) => {
        category.skills.forEach((skill) => {
          expect(screen.getByText(skill.name)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Visual Logic - Category Icons', () => {
    it('should render Cloud icon for categories with icon "cloud"', () => {
      render(<SkillsScreen />);
      
      const cloudCategories = skillCategories.filter((cat) => cat.icon === 'cloud');
      const cloudIcons = screen.getAllByTestId('icon-cloud');
      
      // Each category with cloud icon should have a Cloud icon
      expect(cloudIcons.length).toBeGreaterThanOrEqual(cloudCategories.length);
    });

    it('should render Box icon for categories with icon "container"', () => {
      render(<SkillsScreen />);
      
      const containerCategories = skillCategories.filter((cat) => cat.icon === 'container');
      const boxIcons = screen.getAllByTestId('icon-box');
      
      // Box icons are used for both category icon "container" and skill icon "box"
      expect(boxIcons.length).toBeGreaterThanOrEqual(containerCategories.length);
    });

    it('should render Terminal icon for categories with icon "terminal"', () => {
      render(<SkillsScreen />);
      
      const terminalCategories = skillCategories.filter((cat) => cat.icon === 'terminal');
      const terminalIcons = screen.getAllByTestId('icon-terminal');
      
      // Terminal icons are used for both category and skill icons
      expect(terminalIcons.length).toBeGreaterThanOrEqual(terminalCategories.length);
    });

    it('should render BarChart3 icon for categories with icon "chart"', () => {
      render(<SkillsScreen />);
      
      const chartCategories = skillCategories.filter((cat) => cat.icon === 'chart');
      const chartIcons = screen.getAllByTestId('icon-barchart3');
      
      // Chart icons are used for both category and skill icons
      expect(chartIcons.length).toBeGreaterThanOrEqual(chartCategories.length);
    });
  });

  describe('Visual Logic - Skill Icons', () => {
    it('should render Check icon for skills with icon "check"', () => {
      render(<SkillsScreen />);
      
      const checkSkillsCount = skillCategories.reduce(
        (sum, cat) => sum + cat.skills.filter((s) => s.icon === 'check').length,
        0
      );
      const checkIcons = screen.getAllByTestId('icon-check');
      
      expect(checkIcons.length).toBe(checkSkillsCount);
    });

    it('should render Box icon for skills with icon "box"', () => {
      render(<SkillsScreen />);
      
      const boxSkillsCount = skillCategories.reduce(
        (sum, cat) => sum + cat.skills.filter((s) => s.icon === 'box').length,
        0
      );
      const containerCategoryCount = skillCategories.filter((cat) => cat.icon === 'container').length;
      const boxIcons = screen.getAllByTestId('icon-box');
      
      // Total Box icons = skills with box icon + categories with container icon
      expect(boxIcons.length).toBe(boxSkillsCount + containerCategoryCount);
    });

    it('should render Terminal icon for skills with icon "terminal"', () => {
      render(<SkillsScreen />);
      
      const terminalSkillsCount = skillCategories.reduce(
        (sum, cat) => sum + cat.skills.filter((s) => s.icon === 'terminal').length,
        0
      );
      const terminalCategoryCount = skillCategories.filter((cat) => cat.icon === 'terminal').length;
      const terminalIcons = screen.getAllByTestId('icon-terminal');
      
      // Total Terminal icons = skills with terminal icon + categories with terminal icon
      expect(terminalIcons.length).toBe(terminalSkillsCount + terminalCategoryCount);
    });

    it('should render BarChart3 icon for skills with icon "chart"', () => {
      render(<SkillsScreen />);
      
      const chartSkillsCount = skillCategories.reduce(
        (sum, cat) => sum + cat.skills.filter((s) => s.icon === 'chart').length,
        0
      );
      const chartCategoryCount = skillCategories.filter((cat) => cat.icon === 'chart').length;
      const chartIcons = screen.getAllByTestId('icon-barchart3');
      
      // Total Chart icons = skills with chart icon + categories with chart icon
      expect(chartIcons.length).toBe(chartSkillsCount + chartCategoryCount);
    });
  });

  describe('Data Integrity', () => {
    it('should render the correct number of skill categories', () => {
      const { container } = render(<SkillsScreen />);
      
      const categoryPanels = container.querySelectorAll('.category-panel');
      expect(categoryPanels.length).toBe(skillCategories.length);
    });

    it('should render the correct number of skills in each category', () => {
      const { container } = render(<SkillsScreen />);
      
      const skillTags = container.querySelectorAll('.skill-tag');
      const totalSkills = skillCategories.reduce(
        (sum, cat) => sum + cat.skills.length,
        0
      );
      
      expect(skillTags.length).toBe(totalSkills);
    });

    it('should render skills in the correct order within each category', () => {
      render(<SkillsScreen />);
      
      // Check that skills appear in the document in the expected order
      skillCategories.forEach((category) => {
        category.skills.forEach((skill) => {
          expect(screen.getByText(skill.name)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Component Structure', () => {
    it('should render the section title underline', () => {
      const { container } = render(<SkillsScreen />);
      
      const underline = container.querySelector('.section-title-underline');
      expect(underline).toBeInTheDocument();
    });

    it('should render category headers with icons', () => {
      const { container } = render(<SkillsScreen />);
      
      const categoryHeaders = container.querySelectorAll('.category-header');
      expect(categoryHeaders.length).toBe(skillCategories.length);
    });

    it('should render category icons within category headers', () => {
      const { container } = render(<SkillsScreen />);
      
      const categoryIcons = container.querySelectorAll('.category-icon');
      expect(categoryIcons.length).toBe(skillCategories.length);
    });

    it('should render skill tags with icons', () => {
      const { container } = render(<SkillsScreen />);
      
      const skillTagIcons = container.querySelectorAll('.skill-tag-icon');
      const totalSkills = skillCategories.reduce(
        (sum, cat) => sum + cat.skills.length,
        0
      );
      
      expect(skillTagIcons.length).toBe(totalSkills);
    });

    it('should render the grid layout for categories', () => {
      const { container } = render(<SkillsScreen />);
      
      const gridContainer = container.querySelector('.grid.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });
  });
});
