<template>
  <router-link :to="to" class="plain-link link-card">
    <n-card hoverable size="small">
      <div class="row">
        <div class="main"><slot /></div>
        <span class="arrow" aria-hidden="true">→</span>
      </div>
    </n-card>
  </router-link>
</template>

<script setup>
import { NCard } from 'naive-ui';

defineProps({ to: { type: [String, Object], required: true } });
</script>

<style scoped>
.link-card {
  margin-bottom: 1rem;
}

.row {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.main {
  flex: 1;
  min-width: 0;
}

.arrow {
  font-size: 1.25rem;
  opacity: 0.4;
  transition: transform 0.15s, opacity 0.15s;
}

.link-card:hover .arrow {
  transform: translateX(4px);
  opacity: 1;
}
</style>
