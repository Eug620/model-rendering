/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2024-05-23 23:55:32
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-10-12 16:11:19
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
import { random } from 'lodash'

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
export const useModelsStore = defineStore('app',{
    state: () => ({
        loader: new FBXLoader(),
        renderer: new THREE.WebGLRenderer({ antialias: true }),
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(),
        clock: new THREE.Clock(),
        stats: new Stats(),
        mixer: {},
        isLoad: false,
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
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Jab Cross.fbx'
            },
            {
                key: 's',
                index: 5,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Praying.fbx'
            },
            {
                key: 'd',
                index: 6,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Samba Dancing.fbx'
            },
            {
                key: 'f',
                index: 7,
                instancs: null,
                progress: 0,
                url: 'https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/Whatever Gesture.fbx'
            },
        ] as any[]
    }),
    getters: {
    },
    actions: {
        async init(Doms: HTMLElement) {
            Doms.append(this.renderer.domElement);
            Doms.append(this.stats.dom);
            this.stats.dom.style.position = 'fixed'
            this.stats.dom.style.top = '3.5rem'
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



                this.renderer.pixelRatio = window.devicePixelRatio;
                this.renderer.setSize(offsetWidth, offsetHeight);


                // this.scene.fog = new THREE.Fog('#ccc', 60, 60); //雾化场景
                // this.scene.background = new THREE.Color(0xf2f5f9);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(10, 0, 10);
                this.scene.add(directionalLight);


                const light = new THREE.PointLight('#e2e1e4', 0);
                light.intensity = 6999
                light.position.set(0, 60, 0);
                light.visible = true
                light.castShadow = true;
                this.scene.add(light);
                this.scene.add(new THREE.PointLightHelper(light)) // 光源辅助器
                fetch('https://cdn.jsdelivr.net/gh/eug620/Pics@master/micro-vue/colors.json').then(async res => {
                    const colors = await res.json() || []
                    if (!colors.length) return
                    setInterval(() => {
                        const idx = random(0, colors.length - 1)
                        console.log(idx)

                        light.color.set(colors[idx]?.hex)
                    }, 60000)
                })
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
                    mesh.rotateY(60)
                    mesh.position.y = 19;
                    mesh.position.x = -30;
                    mesh.position.z = -30;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    this.scene.add(mesh);

                });


                this.initModels();
            }


        },
        async renderModels() {
            this.models.forEach(mod => {
                mod.mixer?.update(this.clock.getDelta())
            })
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
                        model.actions[key.index] = (model.mixer as THREE.AnimationMixer).clipAction(item)
                    })
                })
                // model.actions.forEach(item => item.play())
                model.actions[0].play()
                this.scene.add(model.model);
                resolve(model.model);
            });
        },
        async setAnimations(index: number, idx: number) {
            console.log('setAnimations:', index, idx)
            this.models[index].actions.forEach((actions, i) => {
                if (idx !== i) {
                    actions.stop()
                } else {
                    actions.play()
                }
            })
        }
    },
});
