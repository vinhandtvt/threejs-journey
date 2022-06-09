import * as THREE from 'three';
import { Resources } from '../Utils/Resources.component';

export class Floor{
  geometry!: THREE.CircleGeometry;
  textures!: any;
  material!: THREE.MeshStandardMaterial;
  mesh!: THREE.Mesh;

  constructor(private scene: THREE.Scene, private resources: Resources) {
    

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  private setGeometry(): void {
    this.geometry = new THREE.CircleGeometry(5, 64);

  }

  private setTextures(): void {
    this.textures = {};
    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.coding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
    

    
  }
  private setMaterial(): void {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    })
  }
  private setMesh(): void {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = - Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}