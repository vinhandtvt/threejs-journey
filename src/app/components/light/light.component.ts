import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { World } from 'src/app/components/light/World/World.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const world = new World(this.canvas);
    world.render();
    console.log(world);
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  public openDialog() {
    this.dialog.open(DialogComponent, {
      width: '350px',
      height: '200px',
      data: {
        ok: 'test data',
      },
    });
  }
}
