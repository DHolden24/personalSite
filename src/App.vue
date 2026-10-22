<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <div class="page">
      <header class="top">
        <router-link to="/" class="plain-link name">{{ owner.name }}</router-link>
        <n-space align="center">
          <n-button v-for="link in owner.links" :key="link.label" tag="a" :href="link.url" text>
            {{ link.label }}
          </n-button>
          <n-switch v-model:value="dark" size="small" aria-label="Dark mode">
            <template #checked>🌙</template>
            <template #unchecked>☀️</template>
          </n-switch>
        </n-space>
      </header>
      <router-view />
    </div>
  </n-config-provider>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
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
