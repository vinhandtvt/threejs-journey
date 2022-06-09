import { EventEmitter } from "../EventEmitter.component";
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ThisReceiver } from "@angular/compiler";
import { Source } from "../sources.component";


export class Resources extends EventEmitter {

  sources!: any[];
  items: any;
  toLoad!: number;
  loaded!: number;
  loaders!: any;
  constructor(sources: any[]) {
    super();
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;


    this.setLoaders();
    this.startLoading();
    
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();

  }

  async startLoading() {
    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        await this.loaders.gltfLoader.load(
          source.path,
          (file: GLTF) => {
            this.sourceLoaded(source, file);
          }
        )
      }
      if (source.type === 'cubeTexture') {
        await this.loaders.cubeTextureLoader.load(
          source.path,
          (file: any) => {
            this.sourceLoaded(source, file);
          }
        )
      }
      if (source.type === 'texture') {
        await this.loaders.textureLoader.load(
          source.path,
          (file: any) => {
            this.sourceLoaded(source, file);
            
          }
        )
      }
      
    }
  }

  sourceLoaded(source: Source, file: any)
  {
      this.items[source.name] = file
      this.loaded++

      if(this.loaded === this.toLoad)
      {
          this.trigger('ready')
      }
  }
}