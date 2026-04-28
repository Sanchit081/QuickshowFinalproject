export const readStorage = (key, fallback = null) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore write failures from unavailable or full storage.
  }
};

export const removeStorage = (...keys) => {
  if (typeof window === 'undefined') {
    return;
  }

  keys.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore remove failures.
    }
  });
};

export const readJsonStorage = (key, fallback = null) => {
  const value = readStorage(key);
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};
