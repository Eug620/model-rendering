/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2024-05-23 23:55:32
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-26 11:58:24
 * @FilePath     : /model-rendering/src/store/modules/models.ts
 * @Description  : filename
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { defineStore } from "pinia";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { toRaw } from "vue";
import Stats from 'three/addons/libs/stats.module.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import type { Model, Building } from './types';

export const useModelsStore = defineStore('app', {
    state: () => ({
        FBXLoader: new FBXLoader(),
        PLYLoader: new PLYLoader(),
        renderer: new THREE.WebGLRenderer({ antialias: true }),
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(),
        clock: new THREE.Clock(),
        stats: new Stats(), // FPS计数器
        light: new THREE.PointLight('#e2e1e4', 0),
        group: new THREE.Group(),
        mixer: {},
        // 动作交互&方向
        targetRotationY: 0, // 根据鼠标位置计算目标旋转角度
        rotateSpeed: 0.1,
        moveDirection_ws: new THREE.Vector3(), // 存储世界空间中的前进方向
        moveDirection_ad: new THREE.Vector3(), // 存储世界空间中的前进方向
        // 是否已加载场景
        isLoad: false,
        // 第三人称相机跟随配置
        cameraConfig: {
            distance: 50,    // 相机距离角色的距离
            height: 40,       // 相机高度
            smoothness: 0.1  // 平滑过渡系数，值越小越平滑
        },
        models: [
            {
                progress: 0,
                key: "Cheering",
                // url: "//cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/character.fbx",
                // url: "//cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Punching Bag.fbx",
                // url: "//cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Cheering.fbx",
                // url: "/Dancing Twerk.fbx",
                // url: "/Cheering.fbx",
                // url:'/Dancing Twerk.fbx',
                url: "https://unpkg.com/e-cdn@1.0.0/micro-vue/Cheering.fbx",
                position: [0, 1, 0],
                scale: [.15, .15, .15],
                model: null,
                mixer: null,
                actions: []
            },
            // {
            //     progress: 0,
            //     key: "Dancing Twerk",
            //     // url: "//cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/character.fbx",
            //     // url: "//cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Punching Bag.fbx",
            //     // url: "//cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Cheering.fbx",
            //     // url: "/Dancing Twerk.fbx",
            //     // url: "/Cheering.fbx",
            //     // url:'/Dancing Twerk.fbx',
            //     // url:"https://unpkg.com/e-cdn@1.0.0/micro-vue/Cheering.fbx",
            //     // url: "https://unpkg.com/e-cdn@1.0.0/micro-vue/Punching Bag.fbx",
            //     url: "https://unpkg.com/e-cdn@1.0.0/micro-vue/character.fbx",
            //     position: [-20, 0, 0],
            //     scale: [1.5, 1.5, 1.5],
            //     model: null,
            //     mixer: null,
            //     actions: []
            // },
        ] as Model[],
        // 动作列表
        keys: [
            {
                key: 'q',
                index: 0,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Crazy Gesture.fbx'
            },
            {
                key: 'w',
                index: 1,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/FastRun.fbx'
            },
            {
                key: 'e',
                index: 2,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Fighting Idle.fbx'
            },
            {
                key: 'r',
                index: 3,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Hip Hop Dancing.fbx'
            },
            {
                key: 'a',
                index: 4,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Standing Run Left.fbx'
            },
            {
                key: 's',
                index: 5,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Running Backward.fbx'

            },
            {
                key: 'd',
                index: 6,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Right Strafe.fbx'
            },
            {
                key: 'f',
                index: 7,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Whatever Gesture.fbx'
            },
            {
                key: 'z',
                index: 8,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Praying.fbx'
            },
            {
                key: 'x',
                index: 9,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Jab Cross.fbx'
            },
            {
                key: 'c',
                index: 10,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Samba Dancing.fbx'
            }
        ] as any[],
        // 执行动作
        checkKey: 0,
        buildings: [
            {
                progress: 0,
                key: 'Lucy100k',
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Lucy100k.ply',
                position: [50, 19, 50],
                scale: [0.024, 0.024, 0.024],
            }
        ] as Building[],
    }),
    getters: {
    },
    actions: {
        async init(Doms: HTMLElement) {
            Doms.append(this.renderer.domElement);
            Doms.append(this.stats.dom);
            this.stats.dom.style.position = 'fixed'
            this.stats.dom.style.top = '0'
            this.stats.dom.style.bottom = '0'

            // 初始化建筑物
            this.initBuilding()

            // 初始化场景元素
            // this.initAxesHelper()
            // this.initConeGeometry()
            this.initLight()
            this.initPlaneGeometry()
            this.initGridHelper()
            // this.initDirectionalLight(new THREE.Vector3(100, 100, 100));
            // this.initDirectionalLight(new THREE.Vector3(-100, 100, -100));
            // this.initDirectionalLight(new THREE.Vector3(100, 100, -100));
            // this.initDirectionalLight(new THREE.Vector3(-100, 100, 100));


            if (!this.isLoad) {
                this.isLoad = true;
                const { offsetWidth, offsetHeight } = Doms;
                this.renderer.setClearColor('#000000')
                this.renderer.setSize(offsetWidth, offsetHeight)
                this.renderer.setAnimationLoop(this.renderModels)
                this.renderer.shadowMap.enabled = true

                this.camera = new THREE.PerspectiveCamera(75, offsetWidth / offsetHeight, 0.1, 1000)
                // this.camera.fov = 75
                // this.camera.aspect = offsetWidth / offsetHeight,
                // this.camera.near = 0.1
                // this.camera.far =1000
                this.camera.position.set(30, 30, 30); //设置相机位置



                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(offsetWidth, offsetHeight);


                // this.scene.fog = new THREE.Fog('#ccc', 60, 60); //雾化场景
                // this.scene.background = new THREE.Color(0xf2f5f9);



                // const light = new THREE.PointLight('#e2e1e4', 0);


                // 颜色每分钟变换一次
                // fetch('https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/colors.json').then(async res => {
                //     const colors = await res.json() || []
                //     if (!colors.length) return
                //     setInterval(() => {
                //         const idx = random(0, colors.length - 1)
                //         console.log(idx)

                //         this.light.color.set(colors[idx]?.hex)
                //     }, 60000)
                // })


                // 环境光源
                // const AmbientLight = new THREE.AmbientLight('#fff', .5)
                // AmbientLight.receiveShadow = true
                // this.scene.add(AmbientLight)

                // 设置光照
                // 半球光
                // const hemisphereLight = new THREE.HemisphereLight('#ffffff', '#000000', 1.4);
                // hemisphereLight.position.set(0, 50, 0);
                // this.scene.add(hemisphereLight);


                // 聚光灯
                // const spotLight = new THREE.SpotLight('#ffffff', 2)
                // spotLight.position.set(50, 50, 50)
                // spotLight.angle = Math.PI / 8
                // spotLight.penumbra = .2
                // spotLight.decay = 2

                // spotLight.distance = 30
                // spotLight.shadow.radius = 10

                // spotLight.castShadow = true;
                // spotLight.shadow.mapSize = new THREE.Vector2(200, 200)
                // spotLight.shadow.camera.far = 130
                // spotLight.shadow.camera.near = .5
                // this.scene.add(spotLight);

                // 交互
                const controls = new OrbitControls(this.camera, this.renderer.domElement);
                controls.update();

                this.initModels();
            }

        },
        // 初始化建筑物
        initBuilding() {
            this.buildings.forEach(async (building: Building) => {
                building.model = await this.PLYLoader.loadAsync(building.url, (event: ProgressEvent) => {
                    building.progress =
                        Math.round((event.loaded / event.total) * 100 * 100) / 100;
                });
                building.model.scale(...building.scale);
                building.model.computeVertexNormals();

                const material = new THREE.MeshLambertMaterial();
                const mesh = new THREE.Mesh(building.model, material);
                mesh.position.set(...building.position);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                this.scene.add(mesh);
            })

        },
        // 第三人称视角跟随函数 - 跟随物体
        updateThirdPersonCamera(character: THREE.Group) {
            // 计算相机在角色局部坐标系中的目标位置
            // 这个位置在角色后方(distance)和上方(height)
            const targetLocalPosition = new THREE.Vector3(
                0,
                this.cameraConfig.height,
                -this.cameraConfig.distance
            );

            // 将局部坐标转换为世界坐标（考虑角色的旋转）
            const targetWorldPosition = new THREE.Vector3()
                .copy(targetLocalPosition)
                .applyQuaternion(character.quaternion)
                .add(character.position);

            // 平滑过渡到目标位置
            this.camera.position.lerp(targetWorldPosition, this.cameraConfig.smoothness);

            // 让相机看向角色的前方一点（而不是中心点，更自然）
            const lookAtPosition = new THREE.Vector3()
                .set(0, 1, -2)  // 在角色前方一点
                .applyQuaternion(character.quaternion)
                .add(character.position);

            this.camera.lookAt(lookAtPosition);
        },
        /**
         * 初始化平行光
         * @param position 光源位置
         * @param target 照向位置
         */
        initDirectionalLight(position: THREE.Vector3, color = '#ff0000', target: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(position.x, position.y, position.z);
            directionalLight.castShadow = true;
            // 提高阴影贴图分辨率（值越大越清晰，但性能消耗越高）
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;

            // 调整阴影相机的可视范围（控制阴影覆盖区域）
            directionalLight.shadow.camera.near = 5;    // 近平面
            directionalLight.shadow.camera.far = 500;   // 远平面
            directionalLight.shadow.camera.left = -100; // 左边界
            directionalLight.shadow.camera.right = 100; // 右边界
            directionalLight.shadow.camera.top = 100;   // 上边界
            directionalLight.shadow.camera.bottom = -100; // 下边界

            directionalLight.target.position.set(target.x, target.y, target.z);
            this.scene.add(directionalLight);

            // 平行光辅助器
            const helper = new THREE.DirectionalLightHelper(directionalLight, 5, color);
            this.scene.add(helper);
        },
        // 初始化网格线辅助
        initGridHelper() {
            // 添加网格线辅助（可选，用于调试或网格效果）
            const gridHelper = new THREE.GridHelper(800, 80, '#000000', '#000000');
            gridHelper.position.y = 0.01; // 稍微高于地板避免Z轴冲突
            this.scene.add(gridHelper);
        },
        // 初始化地板
        initPlaneGeometry() {
            // 地板 - 可以反光的地板
            const PlaneGeometry = new THREE.PlaneGeometry(800, 800)
            const MeshLambertMaterial = new THREE.MeshLambertMaterial({ color: '#f2f5f9' })
            const plan = new THREE.Mesh(PlaneGeometry, MeshLambertMaterial)
            plan.rotation.x = -0.5 * Math.PI
            plan.receiveShadow = true
            this.scene.add(plan)
        },
        // 初始化灯光
        initLight() {
            this.light.intensity = 6999
            this.light.position.set(0, 60, 0);
            this.light.visible = true
            this.light.castShadow = true;
            this.group.add(this.light);
            this.group.add(new THREE.PointLightHelper(this.light)) // 光源辅助器
            this.scene.add(this.group);
        },
        // 初始化坐标轴辅助器
        initAxesHelper() {
            const axesHelper = new THREE.AxesHelper(100);
            axesHelper.position.set(0, 0.2, 0)
            this.scene.add(axesHelper);
        },
        // 初始化锥体几何体（方向指示器）
        initConeGeometry() {
            // 方向指示器（前端的小三角）
            const indicatorGeometry = new THREE.ConeGeometry(0.5, 2, 3);
            const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
            indicator.position.z = -3; // 放在组的前端（-Z方向为前方）
            indicator.rotation.x = Math.PI / 2;
            this.group.add(indicator);
        },
        // 初始化运动方向
        initMotion() {
            // 计算前后方向的辅助向量
            const ws = new THREE.Vector3(0, 0, 1); // 局部Z轴正方向为前方

            // 计算左右方向的辅助向量
            const ad = new THREE.Vector3(1, 0, 0); // 局部x轴负方向为左方

            // 将局部前进方向转换为世界空间方向
            this.moveDirection_ws.copy(ws).applyQuaternion(this.group.quaternion);
            this.moveDirection_ad.copy(ad).applyQuaternion(this.group.quaternion);
        },
        // 初始化模型
        async initModels() {
            await Promise.all(this.models.map(this.loadModels));
            this.scene.add(this.group);
        },
        // 渲染模型
        async renderModels() {
            this.models.forEach(mod => {
                mod.mixer?.update(this.clock.getDelta())
            })

            // 根据按键状态更新位置和旋转
            if ([1, 4, 5, 6].includes(this.checkKey)) {
                this.initMotion()
                // 按下w奔跑
                if (this.checkKey == 1) { // w
                    this.group.position.add(this.moveDirection_ws.multiplyScalar(1));
                }
                if (this.checkKey == 4) { // a
                    this.group.position.add(this.moveDirection_ad.multiplyScalar(1));
                }
                if (this.checkKey == 5) {// s
                    this.group.position.add(this.moveDirection_ws.multiplyScalar(-1));
                }
                if (this.checkKey == 6) { // d
                    this.group.position.add(this.moveDirection_ad.multiplyScalar(-1));
                }
            }

            // 相机跟随
            this.group && this.updateThirdPersonCamera(this.group)

            // 平滑过渡到目标角度（使用 lerp 实现平滑插值）
            this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, -this.targetRotationY, this.rotateSpeed);


            this.renderer?.render(
                toRaw(this.scene),
                toRaw(this.camera)
            );
            this.stats.update()
        },

        // 加载模型
        async loadModels(model: Model): Promise<THREE.Object3D> {
            // 加载模型动作
            await Promise.all(this.keys.map((k) => {
                return new Promise(async (resolve) => {
                    k.instancs = await this.FBXLoader.loadAsync(k.url, (event: ProgressEvent) => {
                        k.progress =
                            Math.round((event.loaded / event.total) * 100 * 100) / 100;
                    })
                    resolve(null)
                })
            }))
            // 加载主模型
            return new Promise(async (resolve) => {
                model.model = await this.FBXLoader.loadAsync(
                    model.url,
                    (event: ProgressEvent) => {
                        model.progress =
                            Math.round((event.loaded / event.total) * 100 * 100) / 100;
                    }
                );
                model.model.castShadow = true;
                model.model.receiveShadow = true;
                model.model.scale.set(...model.scale)

                model.mixer = new THREE.AnimationMixer(model.model)
                model.model.animations.forEach((item: THREE.AnimationClip, idx: number) => {
                    model.actions[idx] = (model.mixer as THREE.AnimationMixer).clipAction(item)
                })
                /**
                 * 测试动作
                 */
                // console.log(this.keys[0].instancs,'>>>>')
                this.keys.forEach(key => {
                    key.instancs.animations.forEach((item: THREE.AnimationClip) => {

                        // 使用removePositionTracks函数过滤掉动画中所有控制位置的轨道（更彻底的解决方案）
                        if (['w', 'a', 's', 'd'].includes(key.key)) {
                            item.tracks = item.tracks.filter(track => {
                                // 排除所有包含.position的动画轨道
                                return !track.name.includes('.position');
                            });
                        }


                        model.actions[key.index] = (model.mixer as THREE.AnimationMixer).clipAction(item)
                    })
                })
                // 初始化动作
                model.actions[0]?.play()
                // 加入Group
                this.group.add(model.model);
                resolve(model.model);
            });
        },
        async setAnimations(index: number, idx: number) {
            // console.log('setAnimations:', index, idx)
            this.checkKey = idx
            this.models[index]?.actions.forEach((actions, i) => {
                if (idx !== i) {
                    actions.stop()
                } else {
                    actions.play()
                }
            })
        }
    },
});
