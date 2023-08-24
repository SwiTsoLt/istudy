import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { IPosition } from '../controller/controller.service';
import * as canvasSelectors from '../../store/canvas-store/canvas.selector';
import { setCameraPosition } from '../../store/canvas-store/canvas.actions';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement> | null = null;

  public cameraPosition$: Observable<IPosition> = this.canvasStore$.pipe(select(canvasSelectors.selectCameraPosition))

  private sensitivity: number = 0.005
  private inverseX: number = 1
  private inverseY: number = -1
  private isOutOfBox: boolean = false

  constructor(
    private canvasStore$: Store<CanvasState>
  ) { }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.canvasStore$.dispatch(setCameraPosition({ pos: {beta: 50, gamma: 0} }))
    // }, 30)

    // this.canvasStore$.dispatch(setCameraPosition({ pos: { gamma: 0, beta: 50 } }))
  }

  ngAfterViewInit(): void {
    if (this.canvasRef) {
      this.createThreeJsBox(this.canvasRef.nativeElement, window.innerWidth, window.innerHeight)

      window.addEventListener("resize", () => {
        if (this.canvasRef) {
          this.createThreeJsBox(this.canvasRef.nativeElement, window.innerWidth, window.innerHeight)
        }
      })
    }
  }

  createThreeJsBox(canvas: HTMLCanvasElement, windowWidth: number, windowHeight: number): void {
    const scene = new THREE.Scene();

    const material = new THREE.MeshToonMaterial();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      material
    );

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(5, 1.5, 16, 100),
      material
    );

    scene.add(torus, box);

    const clock = new THREE.Clock();

    const canvasSizes = {
      width: windowWidth,
      height: windowHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasSizes.width / canvasSizes.height,
      0.001,
      1000
    );
    camera.position.z = 30;
    scene.add(camera);

    this.cameraPosition$.subscribe((pos: IPosition) => this.cameraPositionHandler(pos, camera))

    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animation objects
      box.rotation.x = elapsedTime;
      box.rotation.y = elapsedTime;
      box.rotation.z = elapsedTime;

      torus.rotation.x = -elapsedTime;
      torus.rotation.y = -elapsedTime;
      torus.rotation.z = -elapsedTime;

      // Render
      renderer.render(scene, camera);

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }

  private cameraPositionHandler(pos: IPosition, camera: THREE.PerspectiveCamera): void {
    const sectorList: number[][] = [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]]

    const maxRadius = 37.5 // 50 * 0.75
    const currentRadius = Math.sqrt(pos.gamma ** 2 + pos.beta ** 2)

    if (currentRadius > maxRadius) {
      const alpha = Math.atan(pos.gamma / pos.beta) * 180 / Math.PI

      const sector = Math.floor(alpha) === 0
        ? sectorList[0]
        : sectorList[Math.floor(360 / alpha)]


      camera.rotation.y += this.sensitivity * sector[0]
      camera.rotation.x += this.sensitivity * sector[1]
    }
  }
}
