/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2024-05-22 22:05:28
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-12 15:33:39
 * @FilePath     : /model-rendering/src/router/routes.ts
 * @Description  : filename
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
export const menus = [
  // 首页
  {
    path: "dashboard",
    name: "dashboard",
    meta: {
      keepAlive: true,
      title: "首页",
      auth: true,
      affix: true,
      icon: "",
    },
    component: () => import("@/views/Dashboard.vue"),
  },

]
export const information = [

]

export default [
  {
    path: "/",
    redirect: "dashboard",
    component: () => import("@/layout/index.vue"),
    children: [...menus, ...information],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    meta: {
      keepAlive: false,
      title: "错误",
      auth: true,
      affix: true,
      icon: "",
    },
    component: () => import("@/views/Error.vue"),
  },
];
