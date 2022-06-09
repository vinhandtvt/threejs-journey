import { Experience } from "../Experiance.component";
import * as THREE from 'three';
import { Environment } from "./Environment.component";
import { Resources } from "../Utils/Resources.component";
import { Floor } from "./Floor.component";
import { Fox } from "./Fox.component";
import { Time } from "../Utils/Time.component";
export class World {

  experience!: Experience;
  environment!: Environment;
  scene!: THREE.Scene;
  resources!: Resources;
  floor!: Floor;
  fox!: Fox;
  time!: Time

  constructor(experience: Experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
  
    // Test mesh 
    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // )
    // this.scene.add(testMesh);
    this.resources.on('ready', () => {
      //setup
      this.floor = new Floor(this.scene, this.resources);
      this.fox = new Fox(this.scene, this.resources, this.time, this.experience.debug);
      this.environment = new Environment(this.experience);
    })
    
    // SET ENVIRONMENT
    
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}