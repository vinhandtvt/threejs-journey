import { Experience } from "../Experiance.component";
import * as THREE from 'three';
import { Resources } from "../Utils/Resources.component";

export class Environment {
  
  experience!: Experience;
  scene!: THREE.Scene;
  sunLight!: THREE.DirectionalLight;
  resources!: Resources
  environmentMap: any;

  constructor(experience: Experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    console.log(this.resources);
    
    this.setSunLight();
    if (this.resources) {
      this.setEnvironmentMap();
    }
    
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, - 1.25)
    this.scene.add(this.sunLight)
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;    
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterial = () => {
      this.scene.traverse((child) => {
        console.log(child, 'traverse child');
        
      })
    }
  }
}