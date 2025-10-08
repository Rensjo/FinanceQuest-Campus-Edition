import { useCallback, useEffect, useRef } from 'react';

interface IDBConfig {
  dbName: string;
  version: number;
  stores: Array<{
    name: string;
    keyPath: string;
    indexes?: Array<{ name: string; keyPath: string; unique?: boolean }>;
  }>;
}

/**
 * Hook for IndexedDB operations - better performance than localStorage for large data
 */
export function useIndexedDB(config: IDBConfig) {
  const dbRef = useRef<IDBDatabase | null>(null);

  // Initialize database
  useEffect(() => {
    const request = indexedDB.open(config.dbName, config.version);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
    };

    request.onsuccess = () => {
      dbRef.current = request.result;
      console.log('✅ IndexedDB initialized:', config.dbName);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      config.stores.forEach((storeConfig) => {
        if (!db.objectStoreNames.contains(storeConfig.name)) {
          const store = db.createObjectStore(storeConfig.name, {
            keyPath: storeConfig.keyPath,
          });

          // Create indexes
          storeConfig.indexes?.forEach((index) => {
            store.createIndex(index.name, index.keyPath, { unique: index.unique });
          });
        }
      });

      console.log('✅ IndexedDB schema updated');
    };

    return () => {
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
    };
  }, [config.dbName, config.version]);

  // Get item from store
  const getItem = useCallback(
    <T = any>(storeName: string, key: string): Promise<T | null> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('Database not initialized'));
          return;
        }

        try {
          const transaction = dbRef.current.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);

          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );

  // Set item in store
  const setItem = useCallback(
    <T = any>(storeName: string, value: T): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('Database not initialized'));
          return;
        }

        try {
          const transaction = dbRef.current.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put(value);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );

  // Delete item from store
  const deleteItem = useCallback(
    (storeName: string, key: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('Database not initialized'));
          return;
        }

        try {
          const transaction = dbRef.current.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(key);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );

  // Get all items from store
  const getAllItems = useCallback(
    <T = any>(storeName: string): Promise<T[]> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('Database not initialized'));
          return;
        }

        try {
          const transaction = dbRef.current.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );

  // Clear store
  const clearStore = useCallback(
    (storeName: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('Database not initialized'));
          return;
        }

        try {
          const transaction = dbRef.current.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );

  // Count items in store
  const countItems = useCallback(
    (storeName: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('Database not initialized'));
          return;
        }

        try {
          const transaction = dbRef.current.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.count();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );

  // Batch operations
  const batchSet = useCallback(
    <T = any>(storeName: string, items: T[]): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('Database not initialized'));
          return;
        }

        try {
          const transaction = dbRef.current.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);

          items.forEach((item) => store.put(item));

          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );

  return {
    getItem,
    setItem,
    deleteItem,
    getAllItems,
    clearStore,
    countItems,
    batchSet,
    db: dbRef.current,
  };
}
