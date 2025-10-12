/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2024-05-22 22:05:28
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2024-06-09 01:18:22
 * @FilePath     : /eug620.github.io/src/router/index.ts
 * @Description  : filename
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import {
  createRouter,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  easing: "ease",
  speed: 1000,
  minimum: 0.2,
  trickle: false,
  trickleSpeed: 800,
});

export const useInitRouter = (app: any) => {
  console.log(app);
  const history = createWebHashHistory();
  const router = createRouter({ history, routes });

  router.beforeEach(async (to, from, next: Function) => {
    if (!NProgress.isStarted()) {
      NProgress.start();
    }
    console.log("[Router]:beforeEach", to.name, from.name);

    if (to.meta.title) {
      document.title = `${to.meta.title}`;
    } else {
      document.title = "Eug";
    }
    next();
  });

  router.afterEach((_) => {
    console.log("[Router]:afterEach");
    NProgress.done();
  });
  router.isReady().then(() => {
    console.log("[Router]:isReady");
  });

  return router;
};
