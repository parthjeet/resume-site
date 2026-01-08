import { describe, it, expect } from 'vitest';
import {
  staggerContainer,
  fadeSlideUp,
  timelineVariants,
  dotVariants,
  rowVariants,
} from './animations';

describe('Animation Variants', () => {
  describe('staggerContainer', () => {
    it('should have hidden and show variants', () => {
      expect(staggerContainer).toHaveProperty('hidden');
      expect(staggerContainer).toHaveProperty('show');
    });

    it('should have opacity 0 when hidden', () => {
      expect(staggerContainer.hidden).toEqual({ opacity: 0 });
    });

    it('should have stagger transition in show state', () => {
      expect(staggerContainer.show).toHaveProperty('opacity', 1);
      expect(staggerContainer.show).toHaveProperty('transition');
      expect((staggerContainer.show as any).transition).toHaveProperty('staggerChildren');
    });
  });

  describe('fadeSlideUp', () => {
    it('should have hidden and show variants', () => {
      expect(fadeSlideUp).toHaveProperty('hidden');
      expect(fadeSlideUp).toHaveProperty('show');
    });

    it('should start with opacity 0 and y offset when hidden', () => {
      expect(fadeSlideUp.hidden).toEqual({ opacity: 0, y: 12 });
    });

    it('should animate to full opacity and y 0 when shown', () => {
      expect((fadeSlideUp.show as any).opacity).toBe(1);
      expect((fadeSlideUp.show as any).y).toBe(0);
    });
  });

  describe('timelineVariants', () => {
    it('should have scaleY 0 when hidden', () => {
      expect(timelineVariants.hidden).toEqual({ scaleY: 0 });
    });

    it('should have scaleY 1 when shown', () => {
      expect((timelineVariants.show as any).scaleY).toBe(1);
    });
  });

  describe('dotVariants', () => {
    it('should have scale 0 when hidden', () => {
      expect(dotVariants.hidden).toEqual({ scale: 0 });
    });

    it('should have scale 1 when shown', () => {
      expect((dotVariants.show as any).scale).toBe(1);
    });

    it('should use spring animation', () => {
      expect((dotVariants.show as any).transition).toHaveProperty('type', 'spring');
    });
  });

  describe('rowVariants', () => {
    it('should have opacity 0 when hidden', () => {
      expect(rowVariants.hidden).toEqual({ opacity: 0 });
    });

    it('should have opacity 1 when shown', () => {
      expect((rowVariants.show as any).opacity).toBe(1);
    });
  });
});
