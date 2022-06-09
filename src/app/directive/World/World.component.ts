import { Experience } from "../Experiance.component";
import * as THREE from 'three';
import { Environment } from "./Environment.component";
import { Resources } from "../Utils/Resources.component";
export class World {

  experience!: Experience;
  environment!: Environment;
  scene!: THREE.Scene;
  resources!: Resources;

  constructor(experience: Experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
  
    // Test mesh 
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial()
    )
    this.scene.add(testMesh);
    this.resources.on('ready', () => {
       //setup
       this.environment = new Environment(this.experience);

      
    })
    
    // SET ENVIRONMENT
    
  }
}