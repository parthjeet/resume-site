import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EducationScreen } from './EducationScreen';
import { education, certifications } from '@/data/content';

describe('EducationScreen', () => {
  beforeEach(() => {
    render(<EducationScreen />);
  });

  // 1. Address Bar Rendering Tests
  describe('Address Bar', () => {
    it('should render the correct file path in the address bar', () => {
      expect(screen.getByText(/C:\\Users\\DevOps\\Credentials\\Education/i)).toBeInTheDocument();
    });

    it('should render back and forward navigation buttons', () => {
      expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/go forward/i)).toBeInTheDocument();
    });

    it('should render a search icon button', () => {
      expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    });
  });

  // 2. Academic History Section Tests
  describe('Academic History Section', () => {
    it('should render the section title "Academic History" with its icon', () => {
      expect(screen.getByRole('heading', { name: /academic history/i })).toBeInTheDocument();
      expect(screen.getByTestId('academic-history-icon')).toBeInTheDocument();
    });

    it('should render the correct number of education entries', () => {
      const educationItems = screen.getAllByRole('heading', { level: 3 });
      expect(educationItems).toHaveLength(education.length);
    });

    it('should display the correct details for each education entry', () => {
      education.forEach(edu => {
        const institution = screen.getByText(edu.institution);
        expect(institution).toBeInTheDocument();
        expect(screen.getByText(edu.degree)).toBeInTheDocument();
        expect(screen.getByText(edu.period)).toBeInTheDocument();
        expect(screen.getByText(edu.location)).toBeInTheDocument();
        expect(screen.getByText(edu.description)).toBeInTheDocument();
      });
    });
  });

  // 3. Industry Certifications Section Tests
  describe('Industry Certifications Section', () => {
    it('should render the section title "Industry Certifications" with its icon', () => {
      expect(screen.getByRole('heading', { name: /industry certifications/i })).toBeInTheDocument();
      expect(screen.getByTestId('industry-certifications-icon')).toBeInTheDocument();
    });

    it('should render the correct number of certification entries', () => {
      // Find all certification cards. A bit more robust than checking headings.
      const certCards = screen.getAllByText(/Issued:/i).map(node => node.closest('.cert-card'));
      expect(certCards).toHaveLength(certifications.length);
    });

    it('should display the correct details for each certification', () => {
      certifications.forEach(cert => {
        const certCard = screen.getByText(cert.name).closest('.cert-card');
        expect(certCard).not.toBeNull();
        const { getByText } = within(certCard!);
        expect(getByText(cert.name)).toBeInTheDocument();
        expect(getByText(cert.level)).toBeInTheDocument();
        expect(getByText(cert.issuer)).toBeInTheDocument();
      });
    });
  });

  // 4. Visual Logic Tests (Lucide Icons for Certs)
  describe('Certification Icon Logic', () => {
    it('should display the correct icon for each certification type', () => {
      certifications.forEach(cert => {
        const certCard = screen.getByText(cert.name).closest('.cert-card');
        expect(certCard).not.toBeNull();

        // The component maps the 'container' data icon to the 'Box' Lucide icon.
        // We need to assert that the rendered icon has the correct class (e.g., .lucide-box).
        const expectedIconClass = `lucide-${cert.icon === 'container' ? 'box' : cert.icon}`;

        const icon = certCard!.querySelector(`.${expectedIconClass}`);
        expect(icon).toBeInTheDocument();
      });
    });
  });
});
