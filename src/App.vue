<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <div class="page">
      <header class="top">
        <router-link to="/" class="plain-link name">{{ owner.name }}</router-link>
        <n-space align="center">
          <n-button v-for="link in owner.links" :key="link.label" tag="a" :href="link.url" text>
            {{ link.label }}
          </n-button>
          <n-switch v-model:value="dark" size="small" aria-label="Dark mode">
            <template #checked-icon>
              <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
                <path fill="currentColor" d="M6 1a7 7 0 1 0 9 9A6 6 0 0 1 6 1z" />
              </svg>
            </template>
            <template #unchecked-icon>
              <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
                <circle cx="8" cy="8" r="3" fill="currentColor" />
                <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" />
              </svg>
            </template>
          </n-switch>
        </n-space>
      </header>
      <router-view />
    </div>
  </n-config-provider>
</template>

<script setup>
import { computed, provide, ref, watch } from 'vue';
import { NButton, NConfigProvider, NGlobalStyle, NSpace, NSwitch, darkTheme, useOsTheme } from 'naive-ui';
import { owner } from './site.js';

const STORAGE_KEY = 'theme';

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

const osTheme = useOsTheme();
const dark = ref((readStoredTheme() ?? osTheme.value) === 'dark');
const theme = computed(() => (dark.value ? darkTheme : null));
// 16px body text. In light mode, Naive's default warning and success tag text is
// too pale on its tint (about 2:1), so it's darkened to pass 4.5:1.
const themeOverrides = computed(() => ({
  common: { fontSize: '16px' },
  ...(dark.value ? {} : { Tag: { textColorWarning: '#8a5300', textColorSuccess: '#0b6b39' } }),
}));
provide('dark', dark);

watch(dark, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
  } catch {
    // Storage unavailable (e.g. private mode); the choice just won't persist.
  }
});
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.name {
  font-weight: 600;
}
</style>
