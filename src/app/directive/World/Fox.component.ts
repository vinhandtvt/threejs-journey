import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Source } from "../sources.component";
import { Debug } from "../Utils/Debug.component";
import { Resources } from "../Utils/Resources.component";
import { Time } from "../Utils/Time.component";
import * as dat from 'lil-gui';
import { ThisReceiver } from "@angular/compiler";

export class Fox {
  resource!: any
  model!: THREE.Group;
  animation!: any;
  debugFolder!: dat.GUI;

  constructor(private scene: THREE.Scene, private resources: Resources, private time: Time, private debug: Debug) {
    //setup debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox');

    }


    this.resource = this.resources.items.foxModel;
    
    this.setModel();
    this.setAnimation();
  }
  
  private setModel(): void {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, .02, .02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    })
  }

  private setAnimation(): void {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    this.animation.actions = {};
    
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);

    this.animation.actions.current = this.animation.actions.running;
    this.animation.actions.current.play(); 

    this.animation.play = (name: string) => {
      const newAction  = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;

    
    }

      //DEbug
      if (this.debug.active) {
        const debugObject = {
          playIdle: () => {this.animation.play('idle')},
          playWalking: () => {this.animation.play('walking')},
          playRunning: () => {this.animation.play('running')},
        }
        this.debugFolder.add(debugObject, 'playIdle');
        this.debugFolder.add(debugObject, 'playWalking');
        this.debugFolder.add(debugObject, 'playRunning');
      }
  }
  
  update(): void {
    this.animation.mixer.update(this.time.delta * .001)
    
  }
}