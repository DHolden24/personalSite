<template>
  <div v-if="html">
    <n-breadcrumb>
      <n-breadcrumb-item><router-link to="/">Projects</router-link></n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="{ name: 'project', params: { id: project.id } }">{{ project.name }}</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>Privacy policy</n-breadcrumb-item>
    </n-breadcrumb>
    <article class="prose" v-html="html"></article>
  </div>
  <not-found-view v-else />
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
import NotFoundView from './NotFoundView.vue';
import { findProject } from '../projects.js';
import { usePageTitle } from '../pageTitle.js';

const props = defineProps({ id: { type: String, required: true } });
const project = computed(() => findProject(props.id));
// Policies are our own Markdown files from the repo, so rendering them as HTML is safe.
const html = computed(() => (project.value?.privacyPolicy ? marked.parse(project.value.privacyPolicy) : ''));

usePageTitle(() => html.value && `${project.value.name} Privacy Policy`);
</script>
