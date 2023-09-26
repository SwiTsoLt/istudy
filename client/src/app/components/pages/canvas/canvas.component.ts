import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import * as THREE from "three";
import { IPosition } from "../../pages/controller/controller.service";
import * as canvasSelectors from "../../../store/canvas-store/canvas.selector";
import { ISelector } from "../room/subject/subject.component";
import * as canvasInterface from "./canvas.interface";
import { mapsData } from "./maps";

import { subjectData } from "../subjectData";
import { SquareEntity } from "./entity/square-entity";
import { CircleEntity } from "./entity/circle-entity";
import { CubeEntity } from "./entity/cube-entity";
import { ModelEntity } from "./entity/model-entity";
import { SphereEntity } from "./entity/sphere-entity";

import * as Stats from "stats.js";

@Component({
    selector: "app-canvas",
    templateUrl: "./canvas.component.html",
    styleUrls: ["./canvas.component.scss"]
})
export class CanvasComponent implements OnInit, AfterViewInit {
    @ViewChild("canvas")
    private canvasRef!: ElementRef<HTMLCanvasElement>;

    public cameraPosition$: Observable<IPosition> = this.canvasStore$.pipe(select(canvasSelectors.selectCameraPosition));
    private sensitivity: number = 0.01;

    public map: ISelector = { title: "", name: "", imageName: "", disabled: true, childList: [] };
    public subjectName: string = "math";

    private renderer!: THREE.WebGLRenderer;
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private windowSize: canvasInterface.IWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    private fieldOfView: number = 50;
    private nearClippingPlane: number = 0.1;
    private farClippingPlane: number = 100;

    private directionalLight!: THREE.DirectionalLight;
    private pointLight!: THREE.PointLight;

    private stats: Stats = new Stats();

    constructor(
        private canvasStore$: Store<CanvasState>,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
            const subjectId: number = Number(paramMap.get("subjectId"));
            const mapId: number = Number(paramMap.get("mapId"));
            const currentMap = subjectData.subjectList[subjectId].childList[mapId];

            this.map = currentMap;
            this.subjectName = subjectData.subjectList[subjectId].name;
        });
    }

    ngAfterViewInit(): void {
        const mapInfo: canvasInterface.IMapData = mapsData[this.subjectName][this.map.name];
        this.createScene(mapInfo);

        window.addEventListener("resize", () => {
            this.createScene(mapInfo);
        });
    }

    // Create canvas

    createScene(mapInfo: canvasInterface.IMapData): void {
        this.initStats();
        this.setCanvasSize();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(mapInfo.background);

        this.initPerspectiveCamera(mapInfo.camera);
        this.cameraPosition$.subscribe((pos: IPosition) => this.cameraPositionHandler(pos, this.camera));
        
        this.initLight();

        mapInfo.scene.forEach((entity: canvasInterface.IEntity) => {
            this.initEntity(entity);
        });

        this.initRenderer();
        this.render();
    }

    private initStats() {
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    private setCanvasSize(): void {
        this.windowSize.width = window.innerWidth;
        this.windowSize.height = window.innerHeight;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";
    }

    // Initialize Camera

    private initPerspectiveCamera(options: canvasInterface.ICamera): void {
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            window.innerWidth / window.innerHeight,
            this.nearClippingPlane,
            this.farClippingPlane
        );

        this.camera.position.set(
            options.position.x,
            options.position.y,
            options.position.z
        );

        this.camera.rotation.set(
            options.rotation.x * Math.PI / 180,
            options.rotation.y * Math.PI / 180,
            options.rotation.z * Math.PI / 180
        );
    }

    private cameraPositionHandler(pos: IPosition, camera: THREE.PerspectiveCamera): void {
        const sectorList: number[][] = [[0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1]];

        const maxRadius = 37.5; // 50 * 0.75
        const currentRadius = Math.sqrt(pos.gamma ** 2 + pos.beta ** 2);

        if (currentRadius > maxRadius) {
            const alpha = Math.atan(pos.gamma / pos.beta) * 180 / Math.PI;

            let sectorIndex: number = 0;

            for (let i = 0; i < 7; i++) {
                const min = i * 45 - 22.5;
                const max = (i + 1) * 45 - 22.5;

                if (Math.abs(alpha) >= min && Math.abs(alpha) < max) {
                    sectorIndex = i;
                    break;
                }
            }

            const sector = sectorList[sectorIndex];

            camera.rotation.y += pos.gamma > 0
                ? this.sensitivity * sector[0]
                : -this.sensitivity * sector[0];
            camera.rotation.x += pos.beta > 0
                ? -this.sensitivity * sector[1]
                : this.sensitivity * sector[1];
        }
    }

    // Initialize light

    private initLight(): void {
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(-5, 5, -5);

        this.scene.add(light);
    }

    // Initialize entities

    private initEntity(entity: canvasInterface.IEntity) {
        switch (entity.type) {
        case canvasInterface.EntityTypeEnum.model:
            this.initModel(entity);
            break;
        case canvasInterface.EntityTypeEnum.cube:
            this.initCube(entity);
            break;
        case canvasInterface.EntityTypeEnum.sphere:
            this.initSphere(entity);
            break;
        case canvasInterface.EntityTypeEnum.square:
            this.initSquare(entity);
            break;
        case canvasInterface.EntityTypeEnum.circle:
            this.initCircle(entity);
            break;

        default:
            break;
        }
    }

    private initModel(entity: canvasInterface.IEntity) {
        const modelEntity: ModelEntity = new ModelEntity(this.subjectName, this.map.name, entity);
        modelEntity.init().subscribe((mesh: THREE.Object3D) => {
            this.scene.add(mesh);
        });
    }

    private initCube(entity: canvasInterface.IEntity) {
        const cubeEntity: CubeEntity = new CubeEntity(entity);
        const mesh: THREE.Mesh = cubeEntity.init();
        this.scene.add(mesh);
    }

    private initSphere(entity: canvasInterface.IEntity) {
        const sphereEntity: SphereEntity = new SphereEntity(entity);
        const mesh: THREE.Mesh = sphereEntity.init();
        this.scene.add(mesh);
    }

    private initSquare(entity: canvasInterface.IEntity) {
        const squareEntity: SquareEntity = new SquareEntity(this.subjectName, this.map.name, entity);
        const mesh: THREE.Mesh = squareEntity.init();
        this.scene.add(mesh);
    }

    private initCircle(entity: canvasInterface.IEntity) {
        const circleEntity: CircleEntity = new CircleEntity(this.subjectName, this.map.name, entity);
        const mesh: THREE.Mesh = circleEntity.init();
        this.scene.add(mesh);
    }

    // Initialize renderer

    private initRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;
    }

    private render() {
        const rend = () => {
            this.stats.begin();
            this.renderer.render(this.scene, this.camera);
            this.stats.end();
            requestAnimationFrame(rend);
        };
        rend();
    }
}
