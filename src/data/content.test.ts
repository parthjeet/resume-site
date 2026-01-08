import { describe, it, expect } from 'vitest';
import {
  personalInfo,
  experiences,
  skillCategories,
  projects,
  education,
  certifications,
  screens,
} from './content';

describe('Content Data', () => {
  describe('personalInfo', () => {
    it('should have required fields', () => {
      expect(personalInfo).toHaveProperty('name');
      expect(personalInfo).toHaveProperty('title');
      expect(personalInfo).toHaveProperty('headline');
      expect(personalInfo).toHaveProperty('bio');
      expect(personalInfo).toHaveProperty('email');
    });

    it('should have valid headline structure', () => {
      expect(personalInfo.headline).toHaveProperty('line1');
      expect(personalInfo.headline).toHaveProperty('line2');
    });
  });

  describe('experiences', () => {
    it('should be an array with at least one item', () => {
      expect(Array.isArray(experiences)).toBe(true);
      expect(experiences.length).toBeGreaterThan(0);
    });

    it('should have required fields for each experience', () => {
      experiences.forEach((exp) => {
        expect(exp).toHaveProperty('id');
        expect(exp).toHaveProperty('title');
        expect(exp).toHaveProperty('company');
        expect(exp).toHaveProperty('period');
        expect(exp).toHaveProperty('achievements');
        expect(exp).toHaveProperty('technologies');
      });
    });

    it('should have unique ids', () => {
      const ids = experiences.map((exp) => exp.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('skillCategories', () => {
    it('should be an array with categories', () => {
      expect(Array.isArray(skillCategories)).toBe(true);
      expect(skillCategories.length).toBeGreaterThan(0);
    });

    it('should have required fields for each category', () => {
      skillCategories.forEach((cat) => {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('title');
        expect(cat).toHaveProperty('skills');
        expect(Array.isArray(cat.skills)).toBe(true);
      });
    });

    it('should have skills with name property', () => {
      skillCategories.forEach((cat) => {
        cat.skills.forEach((skill) => {
          expect(skill).toHaveProperty('name');
        });
      });
    });
  });

  describe('projects', () => {
    it('should be an array with projects', () => {
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should have required fields for each project', () => {
      projects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('title');
        expect(project).toHaveProperty('description');
        expect(project).toHaveProperty('technologies');
      });
    });

    it('should have unique ids', () => {
      const ids = projects.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('education', () => {
    it('should be an array', () => {
      expect(Array.isArray(education)).toBe(true);
    });

    it('should have required fields for each entry', () => {
      education.forEach((edu) => {
        expect(edu).toHaveProperty('id');
        expect(edu).toHaveProperty('institution');
        expect(edu).toHaveProperty('degree');
        expect(edu).toHaveProperty('period');
      });
    });
  });

  describe('certifications', () => {
    it('should be an array', () => {
      expect(Array.isArray(certifications)).toBe(true);
    });

    it('should have required fields for each certification', () => {
      certifications.forEach((cert) => {
        expect(cert).toHaveProperty('id');
        expect(cert).toHaveProperty('name');
        expect(cert).toHaveProperty('level');
      });
    });
  });

  describe('screens', () => {
    it('should be an array with 5 screens', () => {
      expect(Array.isArray(screens)).toBe(true);
      expect(screens.length).toBe(5);
    });

    it('should have required fields for each screen', () => {
      screens.forEach((screen) => {
        expect(screen).toHaveProperty('id');
        expect(screen).toHaveProperty('label');
        expect(screen).toHaveProperty('windowTitle');
      });
    });

    it('should have expected screen ids in order', () => {
      const expectedIds = ['about', 'experience', 'skills', 'projects', 'education'];
      const actualIds = screens.map((s) => s.id);
      expect(actualIds).toEqual(expectedIds);
    });
  });
});
