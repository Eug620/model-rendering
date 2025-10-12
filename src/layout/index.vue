<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2024-05-22 22:26:00
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-13 01:24:20
 * @FilePath     : /model-rendering/src/layout/index.vue
 * @Description  : filename
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="w-screen	h-screen">
    <div class="h-full overflow-y-auto overflow-x-hidden">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" class="animate__animated animate__fadeIn"
          v-if="!route.meta.keepAlive" />

        <keep-alive>
          <component :is="Component" :key="route.fullPath" class="animate__animated animate__fadeIn"
            v-if="route.meta.keepAlive" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style></style>