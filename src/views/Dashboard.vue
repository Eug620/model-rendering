<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-10-12 15:31:47
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-25 15:00:26
 * @FilePath     : /model-rendering/src/views/dashboard.vue
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div class="h-full w-full">
        <div ref="refsThree" class="h-full"></div>
        <div v-if="modelProgress.length || animationsProgress.length"
            class="fixed leading-5 left-0 bottom-0 text-left text-xs p-2 ">
            <div v-if="animationsProgress.length" class="text-sm font-bold my-1">动作:</div>
            <div v-for="ap in animationsProgress" :key="ap.key" class="pr-24">{{ ap?.key.toLocaleUpperCase() }}<span
                    class="text-emerald-400 ml-2">{{ ap?.progress }}%</span> </div>
            <div v-if="modelProgress.length" class="text-sm font-bold my-1">模型:</div>
            <div v-for="mp in modelProgress" :key="mp.key" class="pr-24">{{ mp?.key }}<span
                    class="text-emerald-400  ml-2">{{ mp?.progress }}%</span> </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useModelsStore } from '@/store/modules/models'
const modelsStore = useModelsStore()

const refsThree = ref()
onMounted(() => {
    modelsStore.init(refsThree.value)
})
const keycode = ref<null | number>(null)
const modelProgress = computed(() => {
    return modelsStore.models.filter((v: any) => v.progress < 100)
})
const animationsProgress = computed(() => {
    return modelsStore.keys.filter((v: any) => v.progress < 100)
})

window.addEventListener('keydown', (e: KeyboardEvent) => {
    // console.log(e.key)
    const current = modelsStore.keys.find((v: any) => v.key === e.key)
    if (current && keycode.value !== e.keyCode) {
        keycode.value = e.keyCode
        modelsStore.setAnimations(0, current.index)
    }

})
window.addEventListener('keyup', () => {
    keycode.value = null
    modelsStore.setAnimations(0, 0)
})




// 监听鼠标移动事件，更新鼠标位置
let mouseX = 0;
document.addEventListener('mousemove', (event) => {
    // 鼠标位置变量（归一化坐标，范围[-1,1]）
    // 将鼠标坐标归一化到[-1,1]（原点在屏幕中心）
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    // 根据鼠标位置计算目标旋转角度
    // 限制旋转范围（可选，避免过度旋转）
    modelsStore.targetRotationY = mouseX * Math.PI / 2; // 绕Y轴最大旋转90度

})
</script>

<style></style>