import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-floating-island',
  templateUrl: './floating-island.component.html',
  styleUrls: ['./floating-island.component.scss']
})
export class FloatingIslandComponent implements AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  @HostListener('window:resize', ['$event']) private resize() {

    // Update camera
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }



  @HostListener('mousemove', ['$event']) mousemove(event: MouseEvent) {
    this.mouse.x = event.clientX / this.canvas.clientWidth * 2 - 1;
    this.mouse.y = - (event.clientY / this.canvas.clientHeight) * 2 + 1;
    if (this.currentIntersect) {
      console.log(this.currentIntersect.object.uuid);
      // this.currentIntersect.object.material.color.set( Math.random() * 0xffffff )
    }
  }
  

  @HostListener('click', ['$event']) onclick(event: MouseEvent): void {
    this.currentIntersect.object.material.color.set( Math.random() * 0xffffff )
    if (this.currentIntersect && this.currentIntersect.object.name === 'Icosphere002_2') {
      window.alert('you are fucking weird');
      // this.testAnimation = this.currentIntersect.object
    }
    if (this.currentIntersect && this.currentIntersect.object.name === 'Mesh040') {
       window.alert('you clicked on the island Mesh040');
    }
    
  }
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






  constructor() { }


  ngAfterViewInit(): void {
    /**
     * Lights
     */
    this.initLights();


    /**
     * Model
     */

    this.loadModel()

    // this.addRaycaster();



    /**
     * Camera
     */
    this.loadCamera();

    // this.addCameraHelper();

    // Controls
    this.loadControls();

    /**
     * Renderer
     */
    this.loadRenderer();


    this.tick();
  }

  private loadModel() {
    this.scene.background = new THREE.Color(0xffe4f2);
    console.log(this.loaderGLTF)
    this.loaderGLTF.load(
      'assets/test1/Map_Floating_Island.gltf',
      (gltf: GLTF) => {
        this.model = gltf.scene;
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = child.material.clone();
            this.sceneMeshes.push(child);
          }
        })
        this.sceneMeshes.push(gltf.scene);
        console.log(this.model);
        // var box = new THREE.Box3().setFromObject(this.model);
        // box.getCenter(this.model.position); // this re-sets the mesh position
        this.model.position.multiplyScalar(-9);
        // this.model.position.set(-5, -5, -10)
        this.objectsToTest = [...gltf.scene.children]
        this.scene.add(this.model);

        // this.mixer = new THREE.AnimationMixer(gltf.scene)

        // for (let index = 0; index < gltf.animations.length; index++) {
        //   const action = this.mixer.clipAction(gltf.animations[index])
        //   action.play()
        // }
      }
    );
    this.loaderGLTF.load(
      'assets/test2/Soldier.glb', 
      (data) => {
        console.log('soldier loaded', data);
        const soldier = data.scene;
        soldier.position.set(8, 3.6, -5)
        this.testAnimation = soldier;
        this.scene.add(soldier);
        this.mixer = new THREE.AnimationMixer(data.scene);
        const action = this.mixer.clipAction(data.animations[1]);
        action.play()
      }
    )


  }


  private addRaycaster() {
    this.raycaster = new THREE.Raycaster()
    // this.rayDirection = new THREE.Vector3(10, 0, 0)
    // this.rayDirection.normalize();

  }


  private addCameraHelper(): void {
    const directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
    this.directionalLight.shadow.camera.near = 1
    this.directionalLight.shadow.camera.far = 6

    this.gui.add(directionalLightCameraHelper, 'visible')

    this.scene.add(directionalLightCameraHelper)
  }


  private initLights(): void {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.gui.add(this.ambientLight, 'intensity').min(0).max(5).step(0.001)
    this.scene.add(this.ambientLight)

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    this.directionalLight.position.set(2, 2, - 1)
    this.gui.add(this.directionalLight, 'intensity').min(0).max(5).step(0.001)
    this.gui.add(this.directionalLight.position, 'x').min(- 5).max(5).step(0.001)
    this.gui.add(this.directionalLight.position, 'y').min(- 5).max(5).step(0.001)
    this.gui.add(this.directionalLight.position, 'z').min(- 5).max(5).step(0.001)
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.near = 1
    this.directionalLight.shadow.camera.far = 6
    this.directionalLight.shadow.camera.top = 2
    this.directionalLight.shadow.camera.right = 2
    this.directionalLight.shadow.camera.bottom = - 2
    this.directionalLight.shadow.camera.left = - 2
//You can control the shadow blur with the radius property:
    this.directionalLight.shadow.radius = 10
    this.gui.add(this.directionalLight.shadow, 'radius', 0, 20, 1)

    this.scene.add(this.directionalLight)
  }


  private loadCamera(): void {
    // Base camera
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100)
    this.camera.position.x = 1
    this.camera.position.y = 1
    this.camera.position.z = 2
    this.scene.add(this.camera)
  }

  private loadControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
  }

  private loadRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    })
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

  }

  private tick = () => {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.previousTime
    this.previousTime = elapsedTime
    // Update controls
    this.controls.update()

    if(this.mixer)
    {
        this.mixer.update(deltaTime)
    }
    
    // Cast a ray
    if (this.objectsToTest) {
      this.raycaster.setFromCamera(this.mouse, this.camera); 

      const intersects = this.raycaster.intersectObjects(this.sceneMeshes, false);
      // console.log('intersects', intersects);
      if (intersects.length) {
        if (this.currentIntersect == null) {
          console.log('mouse enter');
          document.documentElement.style.cursor = 'pointer';
        }
        this.currentIntersect = intersects[0];
        // console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.currentIntersect);
        // this.currentIntersect.object.material.color.set( Math.random() * 0xffffff );
        
        
      } else {
        if (this.currentIntersect) {
          console.log('mouse leave');
          document.documentElement.style.cursor = 'auto';
        }
        this.currentIntersect = null;
      }
      
    }
    // if (this.testAnimation) {
    //   this.testAnimation.position.x = Math.sin(elapsedTime * 0.6) * 3
    //   // this.testAnimation.position.z = Math.cos(elapsedTime * 0.6) * 3
    // }
    // // Render
    this.renderer.render(this.scene, this.camera);


    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick)
  }


  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }
}
