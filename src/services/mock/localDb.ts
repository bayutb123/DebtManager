const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const getStorage = <T>(key: string, seed: T): T => {
  if (!USE_MOCKS || typeof window === 'undefined') return seed;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
};

const setStorage = <T>(key: string, value: T) => {
  if (!USE_MOCKS || typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const mockStorage = { get: getStorage, set: setStorage, enabled: USE_MOCKS };
