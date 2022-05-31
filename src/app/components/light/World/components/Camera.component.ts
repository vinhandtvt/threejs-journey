import { Directive } from '@angular/core';
import * as THREE from 'three';

@Directive()
export class Camera {

  camera: THREE.PerspectiveCamera;
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      35, // fov = Field Of View
      1, // aspect ratio (dummy value)
      0.1, // near clipping plane
      100, // far clipping plane
    );
  
    // move the camera back so we can view the scene
    this.camera.position.set(0, 0, 10);

    window.addEventListener('resize', () => {
      console.log('resize from camera component');
      
    })
  }



}

