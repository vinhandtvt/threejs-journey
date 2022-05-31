
import * as THREE from 'three';

export class Scene {
  scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color('skyblue');
  }

}
