/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2024-05-23 23:55:32
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-13 01:28:22
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

interface Model {
    progress: number;
    key: string;
    url: string;
    model: null | any;
    mixer: null | THREE.AnimationMixer,
    position: number[],
    scale: number[],
    actions: THREE.AnimationAction[]
}
export const useModelsStore = defineStore('app', {
    state: () => ({
        loader: new FBXLoader(),
        renderer: new THREE.WebGLRenderer({ antialias: true }),
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(),
        clock: new THREE.Clock(),
        stats: new Stats(), // FPS计数器
        light: new THREE.PointLight('#e2e1e4', 0),
        mixer: {},
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
        checkKey: 0
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

            await Promise.all(this.keys.map((k) => {
                return new Promise(async (resolve) => {
                    k.instancs = await this.loader.loadAsync(k.url, (event: ProgressEvent) => {
                        k.progress =
                            Math.round((event.loaded / event.total) * 100 * 100) / 100;
                    })
                    resolve(null)
                })
            }))
            console.log(this.keys, 'this.keys')

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

                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(10, 0, 10);
                this.scene.add(directionalLight);


                // const light = new THREE.PointLight('#e2e1e4', 0);
                this.light.intensity = 6999
                this.light.position.set(0, 60, 0);
                this.light.visible = true
                this.light.castShadow = true;
                this.scene.add(this.light);
                this.scene.add(new THREE.PointLightHelper(this.light)) // 光源辅助器

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

                // 地板 - 网格
                // const helper = new THREE.GridHelper(800, 800, '#fff', '#ccc');
                // helper.receiveShadow = true;
                // this.scene.add(helper);

                // 地板 - 可以反光的地板
                const PlaneGeometry = new THREE.PlaneGeometry(800, 800)
                const MeshLambertMaterial = new THREE.MeshLambertMaterial({ color: '#f2f5f9' })
                const plan = new THREE.Mesh(PlaneGeometry, MeshLambertMaterial)
                plan.rotation.x = -0.5 * Math.PI
                plan.receiveShadow = true
                this.scene.add(plan)
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

                new PLYLoader().load('https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Lucy100k.ply', (geometry) => {

                    geometry.scale(0.024, 0.024, 0.024);
                    geometry.computeVertexNormals();

                    const material = new THREE.MeshLambertMaterial();

                    const mesh = new THREE.Mesh(geometry, material);
                    // mesh.rotateY(60)
                    mesh.position.y = 19;
                    mesh.position.x = 50;
                    mesh.position.z = 50;

                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    this.scene.add(mesh);

                });


                this.initModels();
            }


        },
        // 第三人称视角跟随函数 - 跟随物体
        updateThirdPersonCamera(character: THREE.Mesh) {
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
        async renderModels() {
            this.models.forEach(mod => {
                mod.mixer?.update(this.clock.getDelta())
            })

            // 按下w奔跑
            if (this.checkKey == 1) { // w
                this.models[0]?.model?.position?.set(
                    this.models[0]?.model.position.x,
                    this.models[0]?.model.position.y,
                    this.models[0]?.model.position.z + 1
                )
            }
            if (this.checkKey == 4) { // a
                this.models[0]?.model?.position?.set(
                    this.models[0]?.model.position.x + 1,
                    this.models[0]?.model.position.y,
                    this.models[0]?.model.position.z
                )
            }
            if (this.checkKey == 5) {// s
                this.models[0]?.model?.position?.set(
                    this.models[0]?.model.position.x,
                    this.models[0]?.model.position.y,
                    this.models[0]?.model.position.z - 1
                )
            }
            if (this.checkKey == 6) { // d
                this.models[0]?.model?.position?.set(
                    this.models[0]?.model.position.x - 1,
                    this.models[0]?.model.position.y,
                    this.models[0]?.model.position.z
                )
            }

            // 相机跟随模型
            this.models[0]?.model && this.updateThirdPersonCamera(this.models[0]?.model)

            // 灯光跟随模型
            this.models[0]?.model && this.light.position.set(this.models[0]?.model.position.x, 60, this.models[0]?.model.position.z);


            this.renderer?.render(
                toRaw(this.scene),
                toRaw(this.camera)
            );
            this.stats.update()
        },
        async initModels() {
            await Promise.all(this.models.map(this.loadModels));
        },
        loadModels(model: Model): Promise<THREE.Object3D> {
            return new Promise(async (resolve) => {
                model.model = await this.loader.loadAsync(
                    model.url,
                    (event: ProgressEvent) => {
                        model.progress =
                            Math.round((event.loaded / event.total) * 100 * 100) / 100;
                    }
                );
                model.model.castShadow = true;
                model.model.receiveShadow = true;

                model.model.scale.set(...model.scale)
                model.model.position.set(...model.position)

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
                // model.actions.forEach(item => item.play())
                model.actions[0]?.play()
                this.scene.add(model.model);
                resolve(model.model);
            });
        },
        async setAnimations(index: number, idx: number) {
            console.log('setAnimations:', index, idx)
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
