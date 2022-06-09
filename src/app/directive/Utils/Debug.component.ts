
import * as dat from 'lil-gui';
export class Debug {
  active!: string;
  ui!: dat.GUI;

  constructor() {
    this.active = window.location.hash;

    if (this.active) {
      this.ui = new dat.GUI();
      
    }

  }
}