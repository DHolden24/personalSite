<template>
  <n-tag round v-bind="$attrs" :type="status === 'Released' ? 'success' : 'warning'">{{ status }}</n-tag>
</template>

<script setup>
import { NTag } from 'naive-ui';

defineProps({ status: { type: String, required: true } });
</script>
