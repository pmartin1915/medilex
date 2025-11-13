import { breakdownTerm, hasBreakdown } from '../componentBreakdown';

describe('componentBreakdown', () => {
  describe('hasBreakdown', () => {
    it('should return true for terms with prefix', () => {
      expect(hasBreakdown('tachy', 'cardia', undefined)).toBe(true);
    });

    it('should return true for terms with suffix', () => {
      expect(hasBreakdown(undefined, 'cardia', 'ia')).toBe(true);
    });

    it('should return true for terms with root only', () => {
      expect(hasBreakdown(undefined, 'cardia', undefined)).toBe(true);
    });

    it('should return false for terms without components', () => {
      expect(hasBreakdown(undefined, undefined, undefined)).toBe(false);
    });
  });

  describe('breakdownTerm', () => {
    it('should breakdown term with prefix and root', () => {
      const result = breakdownTerm('Tachycardia', 'tachy', 'cardia', undefined);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        text: 'tachy',
        type: 'prefix',
      });
      expect(result[1]).toMatchObject({
        text: 'cardia',
        type: 'root',
      });
    });

    it('should breakdown term with root and suffix', () => {
      const result = breakdownTerm('Cardia', undefined, 'cardi', 'a');
      
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        text: 'cardi',
        type: 'root',
      });
      expect(result[1]).toMatchObject({
        text: 'a',
        type: 'suffix',
      });
    });

    it('should breakdown term with all components', () => {
      const result = breakdownTerm('Tachycardia', 'tachy', 'cardi', 'a');
      
      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('prefix');
      expect(result[1].type).toBe('root');
      expect(result[2].type).toBe('suffix');
    });

    it('should return empty array for term without components', () => {
      const result = breakdownTerm('Unknown', undefined, undefined, undefined);
      expect(result).toEqual([]);
    });
  });
});
