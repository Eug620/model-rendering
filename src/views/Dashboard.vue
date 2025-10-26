<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-10-12 15:31:47
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-26 12:41:32
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
            <div v-if="buildingsProgress.length" class="text-sm font-bold my-1">建筑:</div>
            <div v-for="bd in buildingsProgress" :key="bd.key" class="pr-24">{{ bd?.key }}<span
                    class="text-emerald-400  ml-2">{{ bd?.progress }}%</span> </div>
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
const buildingsProgress = computed(() => {
    return modelsStore.buildings.filter((v: any) => v.progress < 100)
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

// 鼠标锁定状态
let isPointerLocked = false;
// 启动鼠标锁定（需用户交互触发）
window.addEventListener('click', () => {
    document.documentElement.requestPointerLock();
    isPointerLocked = true;
});


interface MouseEvent {
    mozMovementX?: number;
    movementX?: number;
    clientX: number;
}
// 监听鼠标移动事件，更新鼠标位置
let mouseX = 0;
document.addEventListener('mousemove', (event: MouseEvent) => {
    if (!isPointerLocked) {
        // 鼠标位置变量（归一化坐标，范围[-1,1]）
        // 将鼠标坐标归一化到[-1,1]（原点在屏幕中心）
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        // 根据鼠标位置计算目标旋转角度
        // 限制旋转范围（可选，避免过度旋转）
        modelsStore.targetRotationY = mouseX * Math.PI / 2; // 绕Y轴最大旋转90度
        // console.log('targetRotationY',modelsStore.targetRotationY);
    } else {
        const movementX = event.movementX || event.mozMovementX || 0;
        // const movementY = event.movementY || event.mozMovementY || 0;
        if (movementX > 0) {
            modelsStore.targetRotationY += (Math.PI / 180); // 绕Y轴旋转
        } else if ((movementX < 0)) {
            modelsStore.targetRotationY -= (Math.PI / 180); // 绕Y轴旋转
        }
        // console.log('mousemove',movementX, movementY);
    }


})
</script>

<style></style>