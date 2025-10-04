import {
  sanitizeInput,
  isValidEmail,
  isValidPhoneNumber,
  isValidCIN,
  isValidCNSS,
  isValidICE,
  sanitizeTextInput,
  isValidSalary,
  isValidDate,
  isPastDate,
} from '@/lib/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeInput('<div>Hello</div>')).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate Moroccan phone numbers', () => {
      expect(isValidPhoneNumber('+212612345678')).toBe(true);
      expect(isValidPhoneNumber('0612345678')).toBe(true);
      expect(isValidPhoneNumber('0712345678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123456789')).toBe(false);
      expect(isValidPhoneNumber('+212123456789')).toBe(false);
    });
  });

  describe('isValidCIN', () => {
    it('should validate CIN numbers', () => {
      expect(isValidCIN('A123456')).toBe(true);
      expect(isValidCIN('AB123456')).toBe(true);
    });

    it('should reject invalid CIN numbers', () => {
      expect(isValidCIN('1234567')).toBe(false);
      expect(isValidCIN('A12345')).toBe(false);
    });
  });

  describe('isValidSalary', () => {
    it('should validate salary amounts', () => {
      expect(isValidSalary(5000)).toBe(true);
      expect(isValidSalary(0)).toBe(true);
      expect(isValidSalary(1000000)).toBe(true);
    });

    it('should reject invalid salary amounts', () => {
      expect(isValidSalary(-100)).toBe(false);
      expect(isValidSalary(1000001)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should validate date formats', () => {
      expect(isValidDate('2024-01-01')).toBe(true);
      expect(isValidDate('2023-12-31')).toBe(true);
    });

    it('should reject invalid date formats', () => {
      expect(isValidDate('01/01/2024')).toBe(false);
      expect(isValidDate('2024-13-01')).toBe(false);
      expect(isValidDate('invalid-date')).toBe(false);
    });
  });

  describe('isPastDate', () => {
    it('should identify past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isPastDate(yesterday.toISOString().split('T')[0])).toBe(true);
    });

    it('should identify future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isPastDate(tomorrow.toISOString().split('T')[0])).toBe(false);
    });
  });

  describe('sanitizeTextInput', () => {
    it('should sanitize and truncate text', () => {
      const longText = 'A'.repeat(300);
      const result = sanitizeTextInput(longText, 100);
      expect(result.length).toBe(100);
    });

    it('should handle HTML in text', () => {
      const htmlText = '<script>alert("xss")</script>Hello World';
      const result = sanitizeTextInput(htmlText);
      expect(result).toBe('Hello World');
    });
  });
});
