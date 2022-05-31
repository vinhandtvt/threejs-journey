import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sizes } from 'src/app/directive/size.component';
import { World } from 'src/app/components/light/World/World.component';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss']
})
export class LightComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  ngOnInit(): void {

  
  }


  ngAfterViewInit(): void {
    const world = new World(this.canvas);
    world.render();
    console.log(world);
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }

}
