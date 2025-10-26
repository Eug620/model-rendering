import * as THREE from "three";

export interface Model {
    progress: number;
    key: string;
    url: string;
    model: null | any;
    mixer: null | THREE.AnimationMixer,
    position: number[],
    scale: number[],
    actions: THREE.AnimationAction[]
}

export interface Building {
    progress: number;
    key: string;
    url: string;
    model: null | any;
    position: [number, number, number],
    scale: [number, number, number],
}