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
    <section v-for="(f, i) in project.features" :key="f.title" class="feature" :class="{ flip: i % 2 }">
      <div class="feature-text">
        <n-h2>{{ f.title }}</n-h2>
        <n-p>{{ f.text }}</n-p>
        <ul v-if="f.points">
          <li v-for="p in f.points" :key="p">{{ p }}</li>
        </ul>
      </div>
      <template v-if="f.screenshot">
        <img v-if="screenshotSrc(f.screenshot)" class="screenshot" :src="screenshotSrc(f.screenshot)" :alt="f.screenshot.alt" />
        <div v-else class="screenshot placeholder" data-test="screenshot-placeholder">
          <n-text depth="3">Screenshot to come: {{ f.screenshot.alt }}</n-text>
        </div>
      </template>
    </section>
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
import { computed, inject } from 'vue';
import { NBreadcrumb, NBreadcrumbItem, NButton, NDivider, NH1, NH2, NP, NSpace, NTag, NText } from 'naive-ui';
import LinkCard from '../components/LinkCard.vue';
import StatusTag from '../components/StatusTag.vue';
import NotFoundView from './NotFoundView.vue';
import { findProject } from '../projects.js';
import { usePageTitle } from '../pageTitle.js';

const props = defineProps({ id: { type: String, required: true } });
const project = computed(() => findProject(props.id));
const dark = inject('dark');

// Prefer the screenshot matching the site theme, but show the other one rather than nothing.
const screenshotSrc = (s) => (dark.value ? s.dark || s.light : s.light || s.dark);

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

.feature {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin: 3rem 0;
}

.feature.flip {
  flex-direction: row-reverse;
}

.feature-text {
  flex: 1;
  min-width: 0;
}

.screenshot {
  flex: none;
  width: 220px;
  aspect-ratio: 9 / 19.5;
  border-radius: 16px;
  object-fit: cover;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  border: 2px dashed currentColor;
  opacity: 0.5;
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .feature,
  .feature.flip {
    flex-direction: column;
    align-items: stretch;
  }

  .screenshot {
    align-self: center;
    width: min(220px, 70%);
  }
}
</style>
