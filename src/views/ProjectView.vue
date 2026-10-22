<template>
  <div v-if="project">
    <n-breadcrumb>
      <n-breadcrumb-item><router-link to="/">Projects</router-link></n-breadcrumb-item>
      <n-breadcrumb-item>{{ project.name }}</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="icon">{{ project.icon }}</div>
    <n-h1 class="heading">{{ project.name }}</n-h1>
    <n-text depth="3" class="tagline">{{ project.tagline }}</n-text>
    <n-space class="tags">
      <status-tag :status="project.status" />
      <n-tag v-for="t in project.tags" :key="t" round :bordered="false">{{ t }}</n-tag>
    </n-space>
    <n-p>{{ project.description }}</n-p>
    <n-space>
      <n-button v-for="l in project.links" :key="l.label" tag="a" :href="l.url" secondary>{{ l.label }} ↗</n-button>
    </n-space>
    <template v-if="project.privacyPolicy">
      <n-divider title-placement="left">Documents</n-divider>
      <link-card :to="{ name: 'privacy', params: { id: project.id } }">
        <n-text strong>Privacy policy</n-text>
      </link-card>
    </template>
  </div>
  <not-found-view v-else />
</template>

<script setup>
import { computed } from 'vue';
import { NBreadcrumb, NBreadcrumbItem, NButton, NDivider, NH1, NP, NSpace, NTag, NText } from 'naive-ui';
import LinkCard from '../components/LinkCard.vue';
import StatusTag from '../components/StatusTag.vue';
import NotFoundView from './NotFoundView.vue';
import { findProject } from '../projects.js';
import { usePageTitle } from '../pageTitle.js';

const props = defineProps({ id: { type: String, required: true } });
const project = computed(() => findProject(props.id));

usePageTitle(() => project.value?.name);
</script>

<style scoped>
.icon {
  margin-top: 1.5rem;
  font-size: 4rem;
}

.heading {
  margin: 0.5rem 0 0.25rem;
}

.tagline {
  font-size: 1.1rem;
}

.tags {
  margin: 1rem 0 1.5rem;
}
</style>
