import { AfterViewInit, Component, ElementRef, HostListener , OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

@Component({
  selector: 'app-haunted-house',
  templateUrl: './haunted-house.component.html',
  styleUrls: ['./haunted-house.component.scss']
})
export class HauntedHouseComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;
  doorColorTexture!: THREE.Texture;
  doorAlphaTexture!: THREE.Texture;
  doorHeightTexture!: THREE.Texture;
  doorAmbienOcclusionTexture!: THREE.Texture;
  doorMetalnessTexture!: THREE.Texture;
  doorNormalTexture!: THREE.Texture;
  doorRoughnessTexture!: THREE.Texture;
  bricksColorTexture!: THREE.Texture;
  bricksAmbientOcclusionTexture!: THREE.Texture;
  bricksNormalTexture!: THREE.Texture;
  bricksRoughnessTexture!: THREE.Texture;
  grassColorTexture!: THREE.Texture;
  grassAmbientOcclusionTexture!: THREE.Texture;
  grassNormalTexture!: THREE.Texture;
  grassRoughnessTexture!: THREE.Texture;

  @HostListener('window:resize', ['$event']) resize() {
    // Update camere
    console.log('this.window.resize', this.canvas.clientWidth);
    
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    // update renderer

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // Debug
  private readonly gui = new dat.GUI();
  
  // Scene
  private scene = new THREE.Scene();

  // Textures
  private textureLoader = new THREE.TextureLoader();

  // House
  private house!: THREE.Group;
  private walls!: THREE.Mesh;
  private roof!: THREE.Mesh;
  private door!: THREE.Mesh;
  private floor!: THREE.Mesh;
  private ambientLight!: THREE.AmbientLight;
  private moonLight!: THREE.DirectionalLight;
  private bush1!: THREE.Mesh;
  private bush2!: THREE.Mesh;
  private bush3!: THREE.Mesh;
  private bush4!: THREE.Mesh;
  private graves!: THREE.Group;
  private ghost1!: THREE.PointLight;
  private ghost2!: THREE.PointLight;
  private ghost3!: THREE.PointLight;
  private ghost4!: THREE.PointLight;

  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  private renderer!: THREE.WebGLRenderer;
  private clock: THREE.Clock = new THREE.Clock();


  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.loadTextures();
    this.createHouse();
    this.createWalls();
    this.createRoof();
    this.createDoor();
    this.createFloor();
    this.createLight();
    this.createCamera();
    this.createControls();
    this.createRenderer();
    // this.addAxesHelper();
    this.createBushes();
    this.createGrave();
    this.ghost1 = this.createGhost();
    this.ghost2 = this.createGhost();
    this.ghost3 = this.createGhost();
    this.scene.add(this.ghost1, this.ghost2, this.ghost3);  
    this.addFog();


    // call renderer next frame
    this.tick()
  }

  private createHouse(): void {
    this.house = new THREE.Group();
    this.scene.add(this.house);
  }

  private createWalls(): void {
    const [x, y, z] = [4, 2.5, 4];
    this.walls = new THREE.Mesh(
      new THREE.BoxGeometry(x, y, z),
      new THREE.MeshStandardMaterial({ 
        map: this.bricksColorTexture,
        aoMap: this.bricksAmbientOcclusionTexture,
        normalMap: this.bricksNormalTexture,
        roughnessMap: this.bricksRoughnessTexture
      })
    );

    this.walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.walls.geometry.attributes['uv'].array, 2))

    this.walls.position.y = y / 2;
    this.house.add(this.walls);
  }

  private loadTextures(): void {
    this.doorColorTexture = this.textureLoader.load('assets/haunted-house/textures/door/color.jpg');
    this.doorAlphaTexture = this.textureLoader.load('assets/haunted-house/textures/door/alpha.jpg');
    this.doorHeightTexture = this.textureLoader.load('assets/haunted-house/textures/door/height.jpg');
    this.doorAmbienOcclusionTexture = this.textureLoader.load('assets/haunted-house/textures/door/ambientOcclusion.jpg');
    this.doorMetalnessTexture = this.textureLoader.load('assets/haunted-house/textures/door/metalness.jpg');
    this.doorNormalTexture = this.textureLoader.load('assets/haunted-house/textures/door/normal.jpg');
    this.doorRoughnessTexture = this.textureLoader.load('assets/haunted-house/textures/door/roughness.jpg');

    this.bricksColorTexture = this.textureLoader.load('assets/haunted-house/textures/bricks/color.jpg');
    this.bricksAmbientOcclusionTexture = this.textureLoader.load('assets/haunted-house/textures/bricks/ambientOcclusion.jpg');
    this.bricksNormalTexture = this.textureLoader.load('assets/haunted-house/textures/bricks/normal.jpg');
    this.bricksRoughnessTexture = this.textureLoader.load('assets/haunted-house/textures/bricks/roughness.jpg');
    
    this.grassColorTexture = this.textureLoader.load('assets/haunted-house/textures/grass/color.jpg');
    this.grassAmbientOcclusionTexture = this.textureLoader.load('assets/haunted-house/textures/grass/ambientOcclusion.jpg');
    this.grassNormalTexture = this.textureLoader.load('assets/haunted-house/textures/grass/normal.jpg');
    this.grassRoughnessTexture = this.textureLoader.load('assets/haunted-house/textures/grass/roughness.jpg');
    this.grassColorTexture.repeat.set(8, 8)
    this.grassAmbientOcclusionTexture.repeat.set(8, 8)
    this.grassNormalTexture.repeat.set(8, 8)
    this.grassRoughnessTexture.repeat.set(8, 8)

    this.grassColorTexture.wrapS = THREE.RepeatWrapping
    this.grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
    this.grassNormalTexture.wrapS = THREE.RepeatWrapping
    this.grassRoughnessTexture.wrapS = THREE.RepeatWrapping
    this.grassColorTexture.wrapT = THREE.RepeatWrapping
    this.grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
    this.grassNormalTexture.wrapT = THREE.RepeatWrapping
    this.grassRoughnessTexture.wrapT = THREE.RepeatWrapping
  }

  private createRoof(): void {
    this.roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({ color: '#b35f45'})
    )
    this.roof.position.y = 2.5 + 0.5;
    this.roof.rotation.y = Math.PI / 4;
    this.house.add(this.roof);
  }

  private createDoor(): void {
    this.door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
      new THREE.MeshStandardMaterial({ 
        map: this.doorColorTexture,
        transparent: true,
        alphaMap: this.doorAlphaTexture,
        aoMap: this.doorAmbienOcclusionTexture,
        displacementMap: this.doorHeightTexture,
        displacementScale: 0.1,
        normalMap: this.doorNormalTexture,
        metalnessMap: this.doorMetalnessTexture,
        roughnessMap: this.doorRoughnessTexture
      
      })
    );
    this.door.position.y = 1;
    this.door.position.z = 2 + 0.01;
    this.door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.door.geometry.attributes['uv'].array, 2))
    this.house.add(this.door);
  }

  private createBushGeometry(): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#89c854'})
    )
  }
  private createFloor(): void {
    this.floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: this.grassColorTexture,
        aoMap: this.grassAmbientOcclusionTexture,
        normalMap: this.grassNormalTexture,
        roughnessMap: this.grassRoughnessTexture
      })
    )
    this.floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.floor.geometry.attributes['uv'].array, 2))
    
    this.floor.rotation.x = - Math.PI * .5;
    this.floor.position.y = 0;
    this.scene.add(this.floor);
  }

  private addFog(): void {
    const fog = new THREE.Fog('#262837', 1, 15);
    this.scene.fog = fog;
  }

  private createGrave(): void {
    this.graves = new THREE.Group();
    this.scene.add(this.graves);

    const graveGeometry = new THREE.BoxGeometry(.6, .8, .2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: '#'});

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.4, z);
      grave.rotation.y = (Math.random() - .5) * .4;
      grave.rotation.z = (Math.random() - .5) * .4;
      this.graves.add(grave);
    }
  }

  private createBushes(): void {
    this.bush1 = this.createBushGeometry();
    this.bush1.scale.set(.5, .5, .5);
    this.bush1.position.set(.8, .2, 2.2);
    this.bush2 = this.createBushGeometry();
    this.bush2.scale.set(.25, .25, .25);
    this.bush2.position.set(1.4, .1, 2.1);
    this.bush3 = this.createBushGeometry();
    this.bush3.scale.set(.4, .4, .4);
    this.bush3.position.set(-.8, .1, 2.2);
    this.bush4 = this.createBushGeometry();
    this.bush4.scale.set(.15, .15, .15);
    this.bush4.position.set(-1, .05, 2.6);
    this.house.add(this.bush1, this.bush2, this.bush3, this.bush4)
  }

  private createLight(): void {
    this.ambientLight = new THREE.AmbientLight('#b9d5ff', .12);
    this.gui.add(this.ambientLight, 'intensity').min(0).max(1).step(0.001);
    this.scene.add(this.ambientLight);

    this.moonLight = new THREE.DirectionalLight('#b9d5ff', .12);
    this.moonLight.position.set(4, 5, -2);
    this.gui.add(this.moonLight, 'intensity').min(0).max(1).step(0.001);
    this.gui.add(this.moonLight.position, 'x').min(-5).max(5).step(0.001);
    this.gui.add(this.moonLight.position, 'y').min(-5).max(5).step(0.001);
    this.gui.add(this.moonLight.position, 'z').min(-5).max(5).step(0.001);
    this.scene.add(this.moonLight);

    const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
    doorLight.position.set(0, 2.2, 2.7);
    this.house.add(doorLight);
  }



  private createGhost() {
    return new THREE.PointLight('#ff00ff', 2, 3);
  }


  private createCamera(): void {
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, .1, 100);
    this.camera.position.set(4, 2, 5);
    this.scene.add(this.camera);
  }

  private createControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enabled = true;
  }

  private createRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor('#262837')
  }

  private addAxesHelper(): void {
    const axes = new THREE.AxesHelper(30);
    this.scene.add(axes);
  }

  private tick = () => {
    const elapsedTime = this.clock.getElapsedTime();

    //update ghost 
    const ghost1Angle = elapsedTime * .5;
    this.ghost1.position.x = Math.cos(ghost1Angle) * 4;
    this.ghost1.position.z = Math.cos(ghost1Angle) * 4;
    this.ghost1.position.y = Math.cos(ghost1Angle) * 3;
    const ghost2Angle = - elapsedTime * .034;
    this.ghost2.position.x = Math.cos(ghost2Angle) * 4;
    this.ghost2.position.z = Math.cos(ghost2Angle) * 4;
    this.ghost2.position.y = Math.cos(ghost2Angle) * 3;


    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call the tick again on the next frame
    window.requestAnimationFrame(this.tick);
  }


  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

}
