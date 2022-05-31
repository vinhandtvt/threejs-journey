import * as THREE from 'three';

export class Cube {
  cube: THREE.Mesh;
  constructor() {
  // create a geometry
  const geometry = new THREE.BoxGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = new THREE.MeshBasicMaterial();

  // create a Mesh containing the geometry and material
  this.cube = new THREE.Mesh(geometry, material);
  }

}