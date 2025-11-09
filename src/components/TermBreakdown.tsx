import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MedicalTerm } from '../types';
import { getTermComponents, hasBreakdown } from '../utils/componentBreakdown';
import { ComponentBadge } from './ComponentBadge';
import { theme } from '../theme/theme';

interface TermBreakdownProps {
  term: MedicalTerm;
  showTitle?: boolean;
  variant?: 'inline' | 'detailed';
}

export const TermBreakdown: React.FC<TermBreakdownProps> = ({
  term,
  showTitle = true,
  variant = 'inline',
}) => {
  if (!hasBreakdown(term)) {
    return null;
  }

  const components = getTermComponents(term.breakdown);

  if (components.length === 0) {
    return null;
  }

  if (variant === 'inline') {
    return (
      <View style={styles.container}>
        {showTitle && <Text style={styles.title}>Word Components</Text>}
        <View style={styles.badgesContainer}>
          {components.map((comp, index) => (
            <React.Fragment key={`${comp.type}-${index}`}>
              <ComponentBadge
                component={comp.component}
                meaning={comp.meaning}
                type={comp.type}
                size="small"
              />
              {index < components.length - 1 && (
                <Text style={styles.plus}>+</Text>
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  }

  // Detailed variant
  return (
    <View style={styles.detailedContainer}>
      {showTitle && <Text style={styles.title}>Component Breakdown</Text>}
      <View style={styles.detailedContent}>
        {components.map((comp, index) => (
          <View key={`${comp.type}-${index}`} style={styles.detailedItem}>
            <ComponentBadge
              component={comp.component}
              meaning={comp.meaning}
              type={comp.type}
              size="medium"
            />
            {comp.etymology && (
              <Text style={styles.etymology}>{comp.etymology}</Text>
            )}
          </View>
        ))}
      </View>
      <View style={styles.formulaContainer}>
        <Text style={styles.formula}>
          {components.map(c => c.component).join(' + ')} = {term.term}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  detailedContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  plus: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textTertiary,
    marginHorizontal: 4,
  },
  detailedContent: {
    gap: 12,
  },
  detailedItem: {
    gap: 6,
  },
  etymology: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  formulaContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  formula: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
