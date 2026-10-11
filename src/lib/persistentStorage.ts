'use client'

/**
 * Dual Storage Engine for Alpha Medical Supplies Store
 * (IndexedDB + LocalStorage)
 */

const DB_NAME = 'alpha_medical_db'
const DB_VERSION = 1
const STORE_NAME = 'alpha_store'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject('IndexedDB not supported')
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function setItemIDB<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(value, key)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    console.warn(`[persistentStorage] IDB save error for "${key}":`, e)
  }
}

export async function getItemIDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result !== undefined ? (req.result as T) : null)
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    return null
  }
}

export function getLocalStorageSync<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    if (item) {
      const parsed = JSON.parse(item)
      if (parsed !== null && parsed !== undefined) return parsed
    }
  } catch (e) {
    console.warn(`[persistentStorage] LocalStorage read error for "${key}":`, e)
  }
  return defaultValue
}

export function savePersistentData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  setItemIDB(key, value).catch((err) => {
    console.error(`[persistentStorage] Failed to store "${key}" in IndexedDB:`, err)
  })

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e: any) {
    try {
      const lightValue = JSON.stringify(value, (k, v) => {
        if (typeof v === 'string' && v.startsWith('data:') && v.length > 50000) {
          return v.slice(0, 500) + '...[IDB_FULL_BLOB]'
        }
        return v
      })
      localStorage.setItem(key, lightValue)
    } catch (innerErr) {}
  }

  window.dispatchEvent(new Event('alpha_content_updated'))
}

export function loadPersistentData<T>(
  key: string,
  defaultValue: T,
  onLoaded: (data: T) => void
): T {
  const syncData = getLocalStorageSync<T>(key, defaultValue)

  if (typeof window !== 'undefined') {
    getItemIDB<T>(key)
      .then((idbData) => {
        if (idbData !== null && idbData !== undefined) {
          onLoaded(idbData)
        } else if (syncData !== defaultValue) {
          onLoaded(syncData)
        }
      })
      .catch(() => {
        onLoaded(syncData)
      })
  }

  return syncData
}
