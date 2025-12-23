/**
 * Encrypted Storage Utilities for Medilex
 *
 * Provides an AsyncStorage backend adapter for use with @healthcare-apps/core
 * encrypted storage system. This enables HIPAA-compliant encrypted storage
 * for user progress data on React Native platforms.
 *
 * @module medilex/utils/encryptedStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createZustandStorageAdapter,
  type StorageBackend,
  type EncryptedStorageConfig,
} from '@healthcare-apps/core';

/**
 * AsyncStorage backend adapter for @healthcare-apps/core.
 * Implements the StorageBackend interface for React Native compatibility.
 */
export const asyncStorageBackend: StorageBackend = {
  getItem: async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};

/**
 * Configuration for medilex encrypted storage
 */
const MEDILEX_STORAGE_CONFIG: Omit<EncryptedStorageConfig, 'storageKey'> = {
  appId: 'medilex',
  version: 1,
  encryptionEnabled: true,
  debug: __DEV__ ?? false,
  storageBackend: asyncStorageBackend,
};

/**
 * Creates an encrypted storage adapter for a medilex Zustand store.
 *
 * @param storageKey - The storage key for this store
 * @param sensitiveFields - Fields to encrypt (user progress, study data)
 * @returns Zustand-compatible storage adapter with encryption
 *
 * @example
 * ```typescript
 * import { persist } from 'zustand/middleware';
 * import { createMedilexStorageAdapter } from '../utils/encryptedStorage';
 *
 * const useMyStore = create(
 *   persist(
 *     (set) => ({ ... }),
 *     {
 *       name: 'my-store',
 *       storage: createMedilexStorageAdapter('my-store-key', ['sensitiveField'])
 *     }
 *   )
 * );
 * ```
 */
export function createMedilexStorageAdapter(
  storageKey: string,
  sensitiveFields: string[] = []
) {
  return createZustandStorageAdapter({
    ...MEDILEX_STORAGE_CONFIG,
    storageKey,
    sensitiveFields,
  });
}

/**
 * Storage keys for medilex stores (consistent with existing keys for migration)
 */
export const ENCRYPTED_STORAGE_KEYS = {
  WORD_STORE: '@vocab_app:word_store',
  STREAK_STORE: '@vocab_app:streak_store',
} as const;

/**
 * Sensitive fields that should be encrypted in each store
 */
export const SENSITIVE_FIELDS = {
  WORD_STORE: ['userProgress'] as const,
  STREAK_STORE: ['studyDates'] as const,
} as const;
