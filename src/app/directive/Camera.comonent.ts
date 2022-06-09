import { Directive } from "@angular/core";
import { Experience } from "./Experiance.component";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sizes } from "./Utils/Sizes.component";


@Directive()
export class Camera {
  experience!: Experience;
  sizes!: Sizes;
  scene!: THREE.Scene;
  canvas!: HTMLCanvasElement;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;

  constructor(experience: Experience) {
    this.experience = experience;
    this.sizes = experience.sizes;
    this.scene = experience.scene;
    this.canvas = experience.canvas;
    
    this.setCamera();
    this.setOrbitControls();
    
  }

  private setCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      .1,
      100
    )
    this.camera.position.set(6, 4, 8);
    this.scene.add(this.camera);
  }

  private setOrbitControls(): void{
    this.controls = new OrbitControls(
      this.camera,
      this.canvas
    );
    this.controls.enableDamping = true;
  }

  public resize(): void {
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
  }

  public update(): void {
    this.controls.update();
  }
}