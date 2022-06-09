import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import * as dat from 'lil-gui';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../light/dialog/dialog.component';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

@Component({
  selector: 'app-floating-island',
  templateUrl: './floating-island.component.html',
  styleUrls: ['./floating-island.component.scss'],
})
export class FloatingIslandComponent implements AfterViewInit {
  @ViewChild('canvas') public canvasRef!: ElementRef;

  @HostListener('window:resize', ['$event']) resize() {
    // Update camera
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  @HostListener('mousemove', ['$event']) mousemove(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;
  }

  @HostListener('click', ['$event']) onclick(event: MouseEvent): void {
    const currentIslandName = this.currentIntersect?.object?.parent?.name;
    switch (currentIslandName) {
      case this.SMART_CITY_ISLAND:
        this.nextMountTain = 1;
        break;
      case this.MID_ROCK_ISLAND:
        this.nextMountTain = 2;
        break;
      case this.MOUNTAIN_ISLAND:
        this.nextMountTain = 3;
        break;
      case this.OCEAN_ISLAND:
        this.nextMountTain = 4;
        break;
      case this.FOREST_ISLAND:
        this.nextMountTain = 5;
        break;
      default:
        this.nextMountTain = 10;
        break;
    }
    if (this.activeMountain === this.nextMountTain) {
      this.openIsland(this.nextMountTain);
    }
    if (this.activeMountain === 6) {
      // this.openIsland(6);

      this.scene.add(this.avatar);
      this.directionalLight.intensity = 4;
    }
  }
  private readonly SMART_CITY_ISLAND = 'Poplar047';
  private readonly MID_ROCK_ISLAND = 'Object008';
  private readonly MOUNTAIN_ISLAND = 'Plane003';
  private readonly OCEAN_ISLAND = 'Plane004';
  private readonly FOREST_ISLAND = 'Object004';
  scene: THREE.Scene = new THREE.Scene();
  ambientLight!: THREE.AmbientLight;
  directionalLight!: THREE.DirectionalLight;
  pointLight!: THREE.PointLight;
  material!: THREE.MeshStandardMaterial;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  renderer!: THREE.WebGLRenderer;
  clock: THREE.Clock = new THREE.Clock();
  gui: dat.GUI = new dat.GUI();
  private loaderGLTF = new GLTFLoader();
  model: any;
  mixer!: THREE.AnimationMixer;
  previousTime = 0;
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  intersects: any;
  objectsToTest: any;
  currentIntersect: any;
  testAnimation: any;
  rayDirection!: THREE.Vector3;
  mouse = new THREE.Vector2();
  sceneMeshes: any[] = [];
  islands: THREE.Group[] = [];
  smartCityIsland!: THREE.Group;
  midRockIsland!: THREE.Group;
  mountainIsland!: THREE.Group;
  oceanIsland!: THREE.Group;
  forestIsland!: THREE.Group;
  nextMountTain = 1;
  activeMountain = 1;
  textureLoader = new THREE.TextureLoader();
  colladaLoader = new ColladaLoader();
  avatar: any;
  dracoLoader = new DRACOLoader()


  constructor(public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.dracoLoader.setDecoderPath('assets/draco/')
    this.loaderGLTF.setDRACOLoader(this.dracoLoader);
    /**
     * Lights
     */
    this.initLights();

    /**
     * Model
     */

    this.loadModel();

    // this.addRaycaster();

    /**
     * Camera
     */
    this.loadCamera();

    // this.addCameraHelper();

    // Controls
    this.loadControls();

    // const fog = new THREE.Fog('lightblue', 1, 20);
    // this.scene.fog = fog;

    /**
     * Renderer
     */
    this.loadRenderer();

    this.tick();
  }

  private loadModel() {
    this.scene.background = this.textureLoader.load('assets/test/sky.jpg');
    this.loaderGLTF.load(
      'assets/test3/Map_Floating_Island.gltf',
      (gltf: GLTF) => {
        gltf.scene.scale.set(.5, .5, .5);
        this.model = gltf.scene;
        // gltf.scene.traverse((child) => {
        //   if (child instanceof THREE.Mesh) {
        //     child.material = child.material.clone();
        //     this.sceneMeshes.push(child);
        //   }
        // });

        this.objectsToTest = [...gltf.scene.children];

        this.smartCityIsland = this.model.getObjectByName(
          this.SMART_CITY_ISLAND
        );
        this.midRockIsland = this.model.getObjectByName(this.MID_ROCK_ISLAND);
        this.mountainIsland = this.model.getObjectByName(this.MOUNTAIN_ISLAND);
        this.oceanIsland = this.model.getObjectByName(this.OCEAN_ISLAND);
        this.forestIsland = this.model.getObjectByName(this.FOREST_ISLAND);
        this.islands.push(
          this.smartCityIsland,
          this.midRockIsland,
          this.mountainIsland,
          this.oceanIsland,
          this.forestIsland
        );
        this.smartCityIsland.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.material = child.material.clone();
            this.sceneMeshes.push(child)
          }
        })
        this.turnOffIsland(this.mountainIsland);
        this.turnOffIsland(this.midRockIsland);
        this.turnOffIsland(this.oceanIsland);
        this.turnOffIsland(this.forestIsland);
        this.scene.add(
          this.smartCityIsland,
          this.midRockIsland,
          this.oceanIsland,
          this.forestIsland,
          this.mountainIsland
        );
      }
    );

    this.colladaLoader.load(
      'assets/stormtrooper/stormtrooper.dae',
      (collada) => {
        this.avatar = collada.scene;
        const animations = this.avatar.animations;

        this.avatar.traverse(function (node: any) {
          if (node instanceof THREE.Mesh) {
            node.frustumCulled = false;
          }
        });

        this.mixer = new THREE.AnimationMixer(this.avatar);
        this.mixer.clipAction(animations[0]).play();
        this.avatar.position.set(-1, -0.6, -2);
        this.avatar.scale.set(1, 0.5, 0.5);
        this.avatar.rotation.z = Math.PI;

      },
      (status) => {
        console.log(status);
        
      }
    );
  }

  private openIsland(islandName: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      height: '150px',
      data: {
        island: islandName,
      },
    });
    dialogRef.afterClosed().subscribe((island: number) => {
      if (island) {
        this.activeMountain += 1;
        this.turnOnIsland(island);
      }
    });
  }

  private turnOffIsland(island: THREE.Group): void {
    island.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.material.opacity = 0.2;
        child.material.transparent = true;
      }
    });
  }
  private turnOnIsland(islandIndex: number): void {
    const nextIsland = this.islands[islandIndex];
    nextIsland.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();
        child.material.opacity = 1;
        child.material.transparent = true;
        this.sceneMeshes.push(child);
      }
    });
  }

  private initLights(): void {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.gui.add(this.ambientLight, 'intensity').min(0).max(5).step(0.001);
    this.scene.add(this.ambientLight);

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(2, 2, -1);
    this.gui.add(this.directionalLight, 'intensity').min(0).max(5).step(0.001);
    this.gui
      .add(this.directionalLight.position, 'x')
      .min(-5)
      .max(5)
      .step(0.001);
    this.gui
      .add(this.directionalLight.position, 'y')
      .min(-5)
      .max(5)
      .step(0.001);
    this.gui
      .add(this.directionalLight.position, 'z')
      .min(-5)
      .max(5)
      .step(0.001);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 6;
    this.directionalLight.shadow.camera.top = 2;
    this.directionalLight.shadow.camera.right = 2;
    this.directionalLight.shadow.camera.bottom = -2;
    this.directionalLight.shadow.camera.left = -2;
    //You can control the shadow blur with the radius property:
    this.directionalLight.shadow.radius = 10;
    this.scene.add(this.directionalLight);
  }

  private loadCamera(): void {
    // Base camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.x = 4;
    this.camera.position.y = 4;
    this.camera.position.z = 15;
    this.scene.add(this.camera);
  }

  private loadControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  private loadRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private tick = () => {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousTime;
    this.previousTime = elapsedTime;
    // Update controls
    this.controls.update();

    if (this.mixer) {
      this.mixer.update(deltaTime);
    }

    // Cast a ray
    if (this.sceneMeshes) {
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(
        this.sceneMeshes,
        true
      );
      if (intersects.length) {
        if (this.currentIntersect == null) {
          document.documentElement.style.cursor = 'pointer';
          console.log('mouse enter');
          
        }
        this.currentIntersect = intersects[0];
      } else {
        if (this.currentIntersect) {
          document.documentElement.style.cursor = 'auto';
          console.log('mouse leave');
          
        }
        this.currentIntersect = null;
      }
    }
    // // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick);
  };

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
}
