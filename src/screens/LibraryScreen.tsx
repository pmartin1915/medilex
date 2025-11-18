import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { SearchBar } from '../components/SearchBar';
import { FilterChip } from '../components/FilterChip';
import { MedicalTermCard } from '../components/MedicalTermCard';
import { MedicalTerm } from '../types';

type SortOption = 'alphabetical' | 'difficulty' | 'mastery' | 'recent';

export const LibraryScreen = () => {
  const terms = useWordStore(state => state.terms);
  const searchTerms = useWordStore(state => state.searchTerms);
  const userProgress = useWordStore(state => state.userProgress);
  const toggleFavorite = useWordStore(state => state.toggleFavorite);
  const toggleBookmark = useWordStore(state => state.toggleBookmark);
  const getProgress = useWordStore(state => state.getProgress);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(terms.map(t => t.category))];
    return cats;
  }, [terms]);

  // Filter and sort terms
  const displayTerms = useMemo(() => {
    let filtered = searchQuery ? searchTerms(searchQuery) : terms;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(t => userProgress[t.id]?.isFavorited);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'alphabetical':
        sorted.sort((a, b) => a.term.localeCompare(b.term));
        break;
      case 'difficulty':
        sorted.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case 'mastery':
        sorted.sort((a, b) => {
          const masteryOrder = { mastered: 0, familiar: 1, learning: 2, new: 3 };
          const aLevel = userProgress[a.id]?.masteryLevel || 'new';
          const bLevel = userProgress[b.id]?.masteryLevel || 'new';
          return masteryOrder[aLevel] - masteryOrder[bLevel];
        });
        break;
      case 'recent':
        sorted.sort((a, b) => {
          const aDate = userProgress[a.id]?.lastStudied || new Date(0);
          const bDate = userProgress[b.id]?.lastStudied || new Date(0);
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
        break;
    }

    return sorted;
  }, [terms, searchQuery, selectedCategory, showFavoritesOnly, sortBy, userProgress, searchTerms]);

  const getMasteryColor = (masteryLevel?: string) => {
    switch (masteryLevel) {
      case 'mastered': return theme.colors.success;
      case 'familiar': return theme.colors.clinical;
      case 'learning': return theme.colors.warning;
      default: return theme.colors.info;
    }
  };

  const renderTerm = ({ item }: { item: MedicalTerm }) => {
    const progress = userProgress[item.id];
    const masteryColor = getMasteryColor(progress?.masteryLevel);

    return (
      <TouchableOpacity
        style={styles.termItem}
        onPress={() => setSelectedTerm(item)}
        activeOpacity={0.7}
      >
        <View style={styles.termHeader}>
          <View style={styles.termTitleRow}>
            <View style={[styles.masteryDot, { backgroundColor: masteryColor }]} />
            <Text style={styles.termName}>{item.term}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.termDefinition} numberOfLines={2}>
          {item.definition}
        </Text>
        {progress?.lastStudied && (
          <Text style={styles.lastStudied}>
            Last studied: {new Date(progress.lastStudied).toLocaleDateString()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const handlePronounce = () => {
    if (selectedTerm && Platform.OS !== 'web') {
      Speech.speak(selectedTerm.term, { rate: 0.75 });
    }
  };

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

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            label={cat}
            isActive={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Sort and Filter Options */}
      <View style={styles.controls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip
            label="Favorites"
            isActive={showFavoritesOnly}
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          />
          <FilterChip
            label="A-Z"
            isActive={sortBy === 'alphabetical'}
            onPress={() => setSortBy('alphabetical')}
          />
          <FilterChip
            label="Difficulty"
            isActive={sortBy === 'difficulty'}
            onPress={() => setSortBy('difficulty')}
          />
          <FilterChip
            label="Mastery"
            isActive={sortBy === 'mastery'}
            onPress={() => setSortBy('mastery')}
          />
          <FilterChip
            label="Recent"
            isActive={sortBy === 'recent'}
            onPress={() => setSortBy('recent')}
          />
        </ScrollView>
      </View>

      {displayTerms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No terms found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your filters or search query
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayTerms}
          renderItem={renderTerm}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Term Detail Modal */}
      <Modal
        visible={selectedTerm !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedTerm(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedTerm(null)}
            >
              <X size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedTerm && (
              <MedicalTermCard
                term={selectedTerm}
                onPronounce={handlePronounce}
                onKnowIt={() => {}}
                onDontKnow={() => {}}
                onBookmark={() => toggleBookmark(selectedTerm.id)}
                onShare={() => {}}
                isBookmarked={getProgress(selectedTerm.id)?.isBookmarked}
                showActions={false}
                scrollEnabled={false}
              />
            )}
          </ScrollView>
        </View>
      </Modal>
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
  filtersContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
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
  termTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  masteryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  termName: {
    fontSize: 18,
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
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  termDefinition: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  lastStudied: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginTop: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
