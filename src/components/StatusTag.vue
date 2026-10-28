<template>
  <n-tag :round="!projectTheme" v-bind="$attrs" :type="status === 'Released' ? 'success' : 'warning'">{{ status }}</n-tag>
</template>

<script setup>
import { inject } from 'vue';
import { NTag } from 'naive-ui';

defineProps({ status: { type: String, required: true } });

// Themed projects use the app's square chips.
const projectTheme = inject('projectTheme', null);
</script>
