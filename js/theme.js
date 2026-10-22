const STORAGE_KEY = 'theme';

function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (e.g. private mode); theme just won't persist.
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function initTheme(toggleButton) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(getStoredTheme() ?? (prefersDark ? 'dark' : 'light'));

  toggleButton?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  });
}
