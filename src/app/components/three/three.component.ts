import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Experience } from 'src/app/directive/Experiance.component';


@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss']
})
export class ThreeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  experience!: Experience;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.experience = new Experience(this.canvas);
  }



  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
}
