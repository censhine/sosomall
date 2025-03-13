<template>
  <div class="privacy-policy">
    <h1>{{ $t('legal.privacyPolicy') }}</h1>
    
    <div class="policy-content">
      <section v-for="(section, index) in sections" :key="index">
        <h2>{{ $t(`legal.privacy.${section.key}.title`) }}</h2>
        <div class="section-content" v-html="$t(`legal.privacy.${section.key}.content`)"></div>
      </section>

      <div class="last-updated">
        {{ $t('legal.lastUpdated') }}: {{ formatDate(lastUpdated) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatDate } from '@/utils/date'

const lastUpdated = ref('2024-01-01')

const sections = [
  { key: 'introduction' },
  { key: 'collection' },
  { key: 'use' },
  { key: 'sharing' },
  { key: 'security' },
  { key: 'cookies' },
  { key: 'rights' },
  { key: 'changes' },
  { key: 'contact' }
]
</script>

<style scoped>
.privacy-policy {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: var(--el-text-color-primary);
}

.policy-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

section {
  margin-bottom: 30px;
}

h2 {
  color: var(--el-text-color-primary);
  margin-bottom: 20px;
  font-size: 1.5em;
}

.section-content {
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.last-updated {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color);
  color: var(--el-text-color-secondary);
  font-size: 14px;
  text-align: right;
}
</style>