import { MedicalTerm } from '../types';
import { getErrorLogger } from './errorLogger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalTerms: number;
    validTerms: number;
    invalidTerms: number;
    duplicateIds: number;
    missingFields: number;
  };
}

export class DataValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * Validate an array of medical terms
   */
  validateTerms(terms: MedicalTerm[]): ValidationResult {
    this.errors = [];
    this.warnings = [];

    const stats = {
      totalTerms: terms.length,
      validTerms: 0,
      invalidTerms: 0,
      duplicateIds: 0,
      missingFields: 0,
    };

    if (!Array.isArray(terms)) {
      this.errors.push('Terms data is not an array');
      return this.buildResult(stats);
    }

    if (terms.length === 0) {
      this.warnings.push('No terms found in dataset');
      return this.buildResult(stats);
    }

    // Check for duplicate IDs
    const seenIds = new Set<string>();
    const seenTerms = new Set<string>();

    terms.forEach((term, index) => {
      const termErrors = this.validateTerm(term, index);

      if (termErrors.length > 0) {
        stats.invalidTerms++;
        termErrors.forEach(err => this.errors.push(err));
      } else {
        stats.validTerms++;
      }

      // Check for duplicate IDs
      if (term.id && seenIds.has(term.id)) {
        stats.duplicateIds++;
        this.errors.push(`Duplicate ID found: ${term.id} at index ${index}`);
      } else if (term.id) {
        seenIds.add(term.id);
      }

      // Check for duplicate term names
      if (term.term && seenTerms.has(term.term.toLowerCase())) {
        this.warnings.push(`Duplicate term name found: "${term.term}" at index ${index}`);
      } else if (term.term) {
        seenTerms.add(term.term.toLowerCase());
      }
    });

    return this.buildResult(stats);
  }

  /**
   * Validate a single medical term
   */
  private validateTerm(term: any, index: number): string[] {
    const errors: string[] = [];
    const prefix = `Term at index ${index}`;

    // Required field validations
    if (!term.id) {
      errors.push(`${prefix}: Missing required field 'id'`);
    }

    if (!term.term || term.term.trim() === '') {
      errors.push(`${prefix}: Missing or empty 'term'`);
    }

    if (!term.pronunciation) {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): Missing 'pronunciation'`);
    }

    if (!term.syllables) {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): Missing 'syllables'`);
    }

    if (!term.partOfSpeech) {
      errors.push(`${prefix} (${term.term || 'unknown'}): Missing 'partOfSpeech'`);
    }

    if (!term.definition || term.definition.trim() === '') {
      errors.push(`${prefix} (${term.term || 'unknown'}): Missing or empty 'definition'`);
    }

    if (!term.example || term.example.trim() === '') {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): Missing 'example'`);
    }

    // Etymology validation
    if (!term.etymology) {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): Missing 'etymology'`);
    } else {
      if (!term.etymology.meaning) {
        this.warnings.push(`${prefix} (${term.term || 'unknown'}): Etymology missing 'meaning'`);
      }
    }

    if (!term.category || term.category.trim() === '') {
      errors.push(`${prefix} (${term.term || 'unknown'}): Missing or empty 'category'`);
    }

    if (!term.specialty) {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): Missing 'specialty'`);
    }

    // Related terms validation
    if (!Array.isArray(term.relatedTerms)) {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): 'relatedTerms' should be an array`);
    } else if (term.relatedTerms.length === 0) {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): No related terms specified`);
    }

    // Difficulty validation
    if (term.difficulty === undefined) {
      errors.push(`${prefix} (${term.term || 'unknown'}): Missing 'difficulty'`);
    } else if (![1, 2, 3, 4, 5].includes(term.difficulty)) {
      errors.push(`${prefix} (${term.term || 'unknown'}): Invalid 'difficulty' (must be 1-5)`);
    }

    // Boolean validations
    if (typeof term.commonlyMisspelled !== 'boolean') {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): 'commonlyMisspelled' should be boolean`);
    }

    // Date validation
    if (!term.createdAt) {
      this.warnings.push(`${prefix} (${term.term || 'unknown'}): Missing 'createdAt'`);
    }

    return errors;
  }

  /**
   * Build the final validation result
   */
  private buildResult(stats: ValidationResult['stats']): ValidationResult {
    const isValid = this.errors.length === 0;

    return {
      isValid,
      errors: this.errors,
      warnings: this.warnings,
      stats,
    };
  }

  /**
   * Log validation results to error logger
   */
  logValidationResults(result: ValidationResult, context: string = 'DataValidator'): void {
    try {
      const errorLogger = getErrorLogger();
      
      if (!result.isValid) {
        result.errors.forEach(error => {
          errorLogger.logError('error', error, undefined, undefined, context);
        });
      }

      result.warnings.forEach(warning => {
        errorLogger.logError('warn', warning, undefined, undefined, context);
      });

      // Log summary
      const summary = `Validation complete: ${result.stats.validTerms}/${result.stats.totalTerms} terms valid`;
      if (result.isValid) {
        errorLogger.logInfo(summary, context);
      } else {
        errorLogger.logError('error', summary, undefined, undefined, context);
      }
    } catch (error) {
      console.error('Failed to log validation results:', error);
    }
  }

  /**
   * Quick validation check - returns true if data is usable
   */
  isDataUsable(terms: MedicalTerm[]): boolean {
    const result = this.validateTerms(terms);

    // Data is usable if:
    // 1. We have at least 1 term
    // 2. No critical errors (missing IDs, terms, or definitions)
    // 3. Less than 50% invalid terms

    const hasTerms = result.stats.totalTerms > 0;
    const mostlyValid = result.stats.invalidTerms < (result.stats.totalTerms * 0.5);

    return hasTerms && mostlyValid;
  }

  /**
   * Get validation summary for display
   */
  getValidationSummary(result: ValidationResult): string {
    const lines = [
      `Total Terms: ${result.stats.totalTerms}`,
      `Valid: ${result.stats.validTerms}`,
      `Invalid: ${result.stats.invalidTerms}`,
      `Duplicate IDs: ${result.stats.duplicateIds}`,
      `Errors: ${result.errors.length}`,
      `Warnings: ${result.warnings.length}`,
      `Status: ${result.isValid ? 'PASS' : 'FAIL'}`,
    ];

    return lines.join('\n');
  }
}

// Singleton instance
export const dataValidator = new DataValidator();
