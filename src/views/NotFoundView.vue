<template>
  <n-result status="404" title="Page not found" description="That page doesn't exist.">
    <template #footer>
      <router-link to="/" class="plain-link">
        <n-button>Back to projects</n-button>
      </router-link>
    </template>
  </n-result>
</template>

<script setup>
import { NButton, NResult } from 'naive-ui';
import { usePageTitle } from '../pageTitle.js';

usePageTitle(() => 'Not found');
</script>
