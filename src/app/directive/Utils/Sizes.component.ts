import { Directive } from "@angular/core";
import { EventEmitter } from "../EventEmitter.component";

@Directive()
export class Sizes extends EventEmitter {
  width!: number;
  height!: number;
  pixelRatio!: number;

  constructor() {
    super();
    // Setup
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize",() => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.trigger('resize');
    })

    
  }
}