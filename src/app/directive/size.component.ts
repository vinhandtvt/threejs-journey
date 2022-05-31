import { Directive } from "@angular/core";
import { ThreeBaseComponent } from "./three-base.component";

@Directive()
export class Sizes extends ThreeBaseComponent {

  width!: number;
  height!: number;
  pixelRatio!: number;

  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  
      this.trigger('resize');
    })
  }




}