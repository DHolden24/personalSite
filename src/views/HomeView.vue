<template>
  <n-h1 class="heading">Projects</n-h1>
  <n-text depth="3">{{ owner.tagline }}</n-text>
  <div class="list">
    <link-card v-for="p in projects" :key="p.id" :to="{ name: 'project', params: { id: p.id } }">
      <div class="project">
        <div class="icon" :style="{ background: p.color + '1f' }">{{ p.icon }}</div>
        <div>
          <n-text strong class="name">{{ p.name }}</n-text>
          <div><n-text depth="3">{{ p.tagline }}</n-text></div>
          <n-space size="small" class="tags">
            <status-tag :status="p.status" size="small" />
            <n-tag v-for="pl in p.platforms" :key="pl" size="small" round :bordered="false">{{ pl }}</n-tag>
          </n-space>
        </div>
      </div>
    </link-card>
  </div>
</template>

<script setup>
import { NH1, NSpace, NTag, NText } from 'naive-ui';
import LinkCard from '../components/LinkCard.vue';
import StatusTag from '../components/StatusTag.vue';
import { owner } from '../site.js';
import { projects } from '../projects.js';
import { usePageTitle } from '../pageTitle.js';

usePageTitle();
</script>

<style scoped>
.heading {
  margin-bottom: 0.25rem;
}

.list {
  margin-top: 2rem;
}

.project {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  font-size: 2.25rem;
}

.name {
  font-size: 1.1rem;
}

.tags {
  margin-top: 0.5rem;
}
</style>
