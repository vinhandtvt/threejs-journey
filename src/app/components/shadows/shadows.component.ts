import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

@Component({
  selector: 'app-shadows',
  templateUrl: './shadows.component.html',
  styleUrls: ['./shadows.component.scss']
})
export class ShadowsComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  @HostListener('window:resize', ['$event']) private resize() {

    // Update camera
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  scene: THREE.Scene = new THREE.Scene();
  ambientLight!: THREE.AmbientLight;
  directionalLight!: THREE.DirectionalLight;
  pointLight!: THREE.PointLight;
  material!: THREE.MeshStandardMaterial;
  sphere!: THREE.Mesh;
  cube!: THREE.Mesh;
  torus!: THREE.Mesh;
  plane!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  renderer!: THREE.WebGLRenderer;
  clock: THREE.Clock = new THREE.Clock();
  gui: dat.GUI = new dat.GUI();;

  constructor() { }

  ngOnInit(): void {



  }

  ngAfterViewInit(): void {
    /**
     * Lights
     */
    this.initLights();
    /**
     * Materials
     */
    this.initMaterials();

    /**
     * Objects
     */
    this.initObjects();

    /**
     * Camera
     */
    this.loadCamera();

    this.addCameraHelper();

    // Controls
    this.loadControls();
    /**
     * Renderer
     */
    this.loadRenderer();


    this.tick();
  }

  private addCameraHelper(): void {
    const directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
    this.directionalLight.shadow.camera.near = 1
    this.directionalLight.shadow.camera.far = 6

    this.gui.add(directionalLightCameraHelper, 'visible')

    this.scene.add(directionalLightCameraHelper)
  }

  private initMaterials() {
    this.material = new THREE.MeshStandardMaterial()
    this.material.roughness = 0.7
    this.gui.add(this.material, 'metalness').min(0).max(1).step(0.001)
    this.gui.add(this.material, 'roughness').min(0).max(1).step(0.001)
  }

  private initLights(): void {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.gui.add(this.ambientLight, 'intensity').min(0).max(1).step(0.001)
    this.scene.add(this.ambientLight)

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this.directionalLight.position.set(2, 2, - 1)
    this.gui.add(this.directionalLight, 'intensity').min(0).max(1).step(0.001)
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

  private initObjects(): void {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    )
    this.sphere.castShadow = true;

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      this.material
    )
    this.plane.rotation.x = - Math.PI * 0.5
    this.plane.position.y = - 0.5;
    this.plane.receiveShadow = true;

    this.scene.add(this.sphere, this.plane)
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

    // Update controls
    this.controls.update()

    // Render
    this.renderer.render(this.scene, this.camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick)
  }


  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }
}
