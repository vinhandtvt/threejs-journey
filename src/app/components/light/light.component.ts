import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss']
})
export class LightComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  @HostListener('window:resize', ['$event']) private resize() {
    // Update sizes
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight
    console.log('hahaa', window.innerWidth);
    
    // Update camera
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

  scene!: THREE.Scene;
  ambientLight!: THREE.AmbientLight;
  pointLight!: THREE.PointLight;
  material!: THREE.MeshStandardMaterial;
  sphere!: THREE.Mesh;
  cube!: THREE.Mesh;
  torus!: THREE.Mesh;
  plane!: THREE.Mesh;
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  renderer!: THREE.WebGLRenderer;
  clock!: THREE.Clock;


  // Dat Gui 
  gui!: dat.GUI;

  ngOnInit(): void {
    this.scene = new THREE.Scene();
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.pointLight = new THREE.PointLight(0xffffff, 0.5)
    this.material = new THREE.MeshStandardMaterial()

  }

  private addAxesHelper() {
    const axes = new THREE.AxesHelper(30)
    this.scene.add(axes)
  }

  private addGuiHelper() {
    this.gui = new dat.GUI();
    this.gui.add(this.ambientLight, 'intensity', 0, 1, .001).name('AmbientLight Intensity');
  }

  ngAfterViewInit(): void {
    this.scene.add(this.ambientLight);
    this.pointLight.position.set(2, 3, 4);
    // this.scene.add(this.pointLight)
    // light 
    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
    directionalLight.position.set(1, .25, 0)

    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
    this.scene.add(hemisphereLight)
    this.scene.add(directionalLight)

    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
    this.scene.add(hemisphereLightHelper)
    
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
    this.scene.add(directionalLightHelper)
    
    const pointLightHelper = new THREE.PointLightHelper(this.pointLight, 0.2)
    this.scene.add(pointLightHelper)

    this.material.roughness = 0.4

    this.addAxesHelper();
    this.addGuiHelper();
    // Objects
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    )
    this.sphere.position.x = - 1.5
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      this.material
    )

    this.torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 32, 64),
      this.material
    )
    this.torus.position.x = 1.5

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      this.material
    )
    this.plane.rotation.x = - Math.PI * 0.5
    this.plane.position.y = - 0.65

    this.scene.add(this.sphere, this.cube, this.plane, this.torus);

    // Base camera
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 1, 1000)
    this.camera.position.x = 1
    this.camera.position.y = 1
    this.camera.position.z = 2
    this.scene.add(this.camera)


    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.clock = new THREE.Clock();

    this.tick()

  }
  private createSpheren(): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    )
  }

  private tick = () => {
    const elapsedTime = this.clock.getElapsedTime()

    // Update objects
    this.sphere.rotation.y = 0.1 * elapsedTime
    this.cube.rotation.y = 0.1 * elapsedTime
    this.torus.rotation.y = 0.1 * elapsedTime

    this.sphere.rotation.x = 0.15 * elapsedTime
    this.cube.rotation.x = 0.15 * elapsedTime
    this.torus.rotation.x = 0.15 * elapsedTime

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
