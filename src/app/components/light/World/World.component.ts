import { Directive, OnInit } from '@angular/core';
import * as THREE from 'three';

import { Camera } from './components/Camera.component';
import { Cube } from './components/Cube.component';
import { Scene } from './components/Scene.component';
import { Renderer } from './systems/renderer.component';
import { Resizer } from './systems/Resizer.component';

 @Directive()
export class World  {

  private camera;
  private scene: Scene;
   renderer: Renderer;

  constructor(container: any) {
    this.camera = new Camera();
    this.scene = new Scene();
    this.renderer = new Renderer(container);
    console.log(this.scene);
    const cube = new Cube();
    this.scene.scene.add(cube.cube);
    const resizer = new Resizer(container, this.camera.camera, this.renderer.renderer);
    
  }
  
  // Render the scene
  render() {
    this.renderer.renderer.render(this.scene.scene, this.camera.camera);
  }

}