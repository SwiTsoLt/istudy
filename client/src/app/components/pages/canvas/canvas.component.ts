import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { IPosition } from '../../pages/controller/controller.service';
import * as canvasSelectors from '../../../store/canvas-store/canvas.selector';
import { setCameraPosition } from '../../../store/canvas-store/canvas.actions';
import { IMap, ISubject } from '../room/subject/subject.component';
import { EntityTypeEnum, ICamera, IEntity, IMapData, IWindowSize } from './canvas.interface';
import { mapsData } from './maps';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const subjectData: { subjectList: ISubject[] } = require("../subjectData.json");

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  public cameraPosition$: Observable<IPosition> = this.canvasStore$.pipe(select(canvasSelectors.selectCameraPosition))
  private sensitivity: number = 0.01

  private map: IMap = { title: "", mapName: "", imageName: "", disabled: true }
  private subjectName: string = "math"

  private renderer!: THREE.WebGLRenderer;;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private windowSize: IWindowSize = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  private loaderGLTF: GLTFLoader = new GLTFLoader()

  private fieldOfView: number = 1;
  private nearClippingPlane: number = 1;
  private farClippingPlane: number = 4000;

  private directionalLight!: THREE.DirectionalLight;
  private pointLight!: THREE.PointLight;

  constructor(
    private canvasStore$: Store<CanvasState>,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const subjectId: number = Number(paramMap.get("subjectId"))
      const mapId: number = Number(paramMap.get("mapId"))
      const currentMap = subjectData.subjectList[subjectId].mapList[mapId]

      this.map = currentMap
      this.subjectName = subjectData.subjectList[subjectId].subjectName
    })
  }

  ngAfterViewInit(): void {
    const mapInfo: IMapData = mapsData[this.subjectName][this.map.mapName]
    this.createScene(mapInfo)

    window.addEventListener("resize", () => {
      this.createScene(mapInfo)
    })
  }

  createScene(mapInfo: IMapData): void {
    this.setCanvasSize()

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(mapInfo.background)

    this.initPerspectiveCamera(mapInfo.camera)
    this.cameraPosition$.subscribe((pos: IPosition) => this.cameraPositionHandler(pos, this.camera))
    this.initLight()

    mapInfo.scene.forEach((entity: IEntity) => {
      this.initEntity(entity)
    })

    this.startRendering()
  }

  private setCanvasSize(): void {
    this.windowSize.width = window.innerWidth;
    this.windowSize.height = window.innerHeight;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.canvas.style.width = window.innerWidth + "px"
    this.canvas.style.height = window.innerHeight + "px"
  }

  private initEntity(entity: IEntity) {
    switch (entity.type) {
      case EntityTypeEnum.model:
        this.initModel(entity)
        break;

      default:
        break;
    }
  }

  private initModel(entity: IEntity) {
    const assetPath = `/app/media/canvas/assets/${this.subjectName}/${this.map.mapName}/${entity.texture}/scene.gltf`
    this.loaderGLTF.load(assetPath, (gltf: GLTF) => {
      const model = gltf.scene.children[0]
   
      model.position.x = entity.position.x
      model.position.y = entity.position.y
      model.position.z = entity.position.z

      model.rotation.x = entity.rotation.x * Math.PI / 180
      model.rotation.y = entity.rotation.y * Math.PI / 180
      model.rotation.z = entity.rotation.z * Math.PI / 180

      model.position.multiplyScalar(entity.multiplyScalar)

      this.scene.add(model)
    })
  }

  private initPerspectiveCamera(options: ICamera): void {
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.canvas.clientWidth / this.canvas.clientHeight,
      this.nearClippingPlane,
      this.farClippingPlane
    )

    this.camera.position.x = options.position.x
    this.camera.position.y = options.position.y
    this.camera.position.z = options.position.z

    this.camera.rotation.x = options.rotation.x * Math.PI / 180
    this.camera.rotation.y = options.rotation.y * Math.PI / 180
    this.camera.rotation.z = options.rotation.z * Math.PI / 180
  }

  private initLight(): void {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
    this.directionalLight.position.set(0, 1, 0)
    this.directionalLight.castShadow = true

    this.pointLight = new THREE.PointLight(0xffffff)
    this.pointLight.position.set(0, 200, 400)

    this.scene.add(this.directionalLight)
    this.scene.add(this.pointLight)
  }

  private cameraPositionHandler(pos: IPosition, camera: THREE.PerspectiveCamera): void {
    const sectorList: number[][] = [[0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1]]

    const maxRadius = 37.5 // 50 * 0.75
    const currentRadius = Math.sqrt(pos.gamma ** 2 + pos.beta ** 2)

    if (currentRadius > maxRadius) {
      const alpha = Math.atan(pos.gamma / pos.beta) * 180 / Math.PI

      let sectorIndex: number = 0;

      for (let i = 0; i < 7; i++) {
        const min = i * 45 - 22.5
        const max = (i + 1) * 45 - 22.5

        if (Math.abs(alpha) >= min && Math.abs(alpha) < max) {
          sectorIndex = i
          break;
        }
      }

      const sector = sectorList[sectorIndex]

      camera.rotation.y += pos.gamma > 0
        ? this.sensitivity * sector[0]
        : -this.sensitivity * sector[0]
      camera.rotation.x += pos.beta > 0
        ? -this.sensitivity * sector[1]
        : this.sensitivity * sector[1]
    }
  }

  private startRendering(): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    const component = this;

    function render() {
      requestAnimationFrame(render)
      component.renderer.render(component.scene, component.camera)
    }
    render()
  }
}
