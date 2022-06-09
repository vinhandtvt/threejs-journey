import { Directive } from "@angular/core";
import { Sizes } from "./Utils/Sizes.component";
import { Time } from "./Utils/Time.component";
import * as THREE from 'three';
import { Camera } from "./Camera.comonent";
import { Renderer } from "./Renderer.component";
import { World } from "./World/World.component";
import { Resources } from "./Utils/Resources.component";
import { Sources } from "./sources.component";
import { Debug } from "./Utils/Debug.component";


@Directive()
export class Experience {
  scene!: THREE.Scene;
  canvas!: HTMLCanvasElement;
  sizes!: Sizes;
  time!: Time;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  resources!: Resources;
  debug!: Debug;

  constructor(canvas: HTMLCanvasElement) {    

    //Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    
    // resize event
    this.sizes.on('resize', () => {
      this.resize();
    })

    this.time = new Time();

    this.time.on('tick', () => {
      this.update();
    })
    
    // THREEJS SCENE
    this.scene = new THREE.Scene();
    this.resources = new Resources(Sources.sources);

    // Resources

    // Init Camera
    this.camera = new Camera(this);

    // Renderer
    this.renderer = new Renderer(this);

    //World
    this.world = new World(this);

    

  }

  private resize(): void {
    //TODO: Handle resize event  
    this.camera.resize()
    this.renderer.resize();
  }

  private update(): void {
    this.camera.update();
    this.world.update();
    this.renderer.update()
    
  }

}