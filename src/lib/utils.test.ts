import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle conditional classes with boolean', () => {
    const result = cn('base', true && 'active');
    expect(result).toBe('base active');
  });

  it('should filter out falsy values', () => {
    const result = cn('base', false && 'inactive', null, undefined, 'end');
    expect(result).toBe('base end');
  });

  it('should merge tailwind classes and resolve conflicts', () => {
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toBe('py-2 px-6');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle array inputs', () => {
    const result = cn(['px-4', 'py-2']);
    expect(result).toBe('px-4 py-2');
  });

  it('should handle object inputs', () => {
    const result = cn({ 'px-4': true, 'py-2': false, 'mt-2': true });
    expect(result).toBe('px-4 mt-2');
  });
});
