
import * as THREE from 'three';

export class Renderer {
  renderer: THREE.WebGLRenderer;
  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });

  }
}

