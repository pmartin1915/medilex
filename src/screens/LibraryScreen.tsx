import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { SearchBar } from '../components/SearchBar';
import { MedicalTerm } from '../types';

export const LibraryScreen = () => {
  const terms = useWordStore(state => state.terms);
  const searchTerms = useWordStore(state => state.searchTerms);
  const [searchQuery, setSearchQuery] = useState('');

  const displayTerms = searchQuery ? searchTerms(searchQuery) : terms;

  // Memoize render function to prevent unnecessary re-renders
  const renderTerm = useCallback(({ item }: { item: MedicalTerm }) => (
    <TouchableOpacity style={styles.termItem}>
      <View style={styles.termHeader}>
        <Text style={styles.termName}>{item.term}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.termDefinition} numberOfLines={2}>
        {item.definition}
      </Text>
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Library</Text>
        <Text style={styles.subtitle}>{displayTerms.length} terms</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search medical terms..."
      />

      <FlatList
        data={displayTerms}
        renderItem={renderTerm}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  list: {
    padding: 16,
  },
  termItem: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    ...theme.shadows.sm,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  termDefinition: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
