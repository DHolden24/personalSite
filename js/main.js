import { initTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme(document.getElementById('theme-toggle'));
  document.getElementById('year').textContent = new Date().getFullYear();
});
