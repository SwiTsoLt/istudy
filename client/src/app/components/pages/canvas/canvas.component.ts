import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, of, take } from "rxjs";
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
    // Canvas

    @ViewChild("canvas")
    private canvasRef!: ElementRef<HTMLCanvasElement>;

    //Camera

    private camera!: THREE.PerspectiveCamera;
    public cameraPosition$: Observable<IPosition> = this.canvasStore$.pipe(select(canvasSelectors.selectCameraPosition));
    private moveCameraStates: Observable<canvasInterface.IMoveCameraStates> = of({
        x: 0,
        y: 0,
        z: 0
    });

    private readonly FIELD_OF_VIEW: number = 50; // canvas scene value
    private readonly NEAR_CLIPPING_PLANE: number = 0.1; // canvas scene value
    private readonly FAR_CLIPPING_PLANE: number = 100; // canvas scene value
    private readonly CAMERA_MOVEMENT_SENSITIVITY: number = 0.01; // canvas scene value
    private readonly UPDATE_CAMERA_DURATION = 30; // milliseconds ≈ 120fps

    // Map

    public map: ISelector = { title: "", name: "", imageName: "", disabled: true, childList: [] };
    public subjectName: string = "math";
    public mapInfo!: canvasInterface.IMapData;

    // Scene

    private windowSize: canvasInterface.IWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    private renderer!: THREE.WebGLRenderer;
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
    private scene!: THREE.Scene;

    // Stats

    private stats: Stats = new Stats();

    constructor(
        private canvasStore$: Store<CanvasState>,
        private route: ActivatedRoute
    ) { }

    // NgOnInit, NgAfterViewInit

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
        this.mapInfo = mapsData[this.subjectName][this.map.name];
        this.createScene(this.mapInfo);
        this.initStats(); // Dev

        window.addEventListener("resize", () => {
            this.createScene(this.mapInfo);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Create canvas

    createScene(mapInfo: canvasInterface.IMapData): void {
        this.setCanvasSize();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(mapInfo.background);

        this.initPerspectiveCamera(mapInfo.camera);
        this.cameraPosition$.subscribe((pos: IPosition) => this.cameraPositionHandler(pos));

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
            this.FIELD_OF_VIEW,
            window.innerWidth / window.innerHeight,
            this.NEAR_CLIPPING_PLANE,
            this.FAR_CLIPPING_PLANE
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

        setInterval(() => {
            this.moveCameraStates
                .pipe(take(1))
                .subscribe((state: canvasInterface.IMoveCameraStates) => {
                    this.camera.rotation.x += state.x;
                    this.camera.rotation.y += state.y;
                    this.camera.rotation.z += state.z;
                });
        }, this.UPDATE_CAMERA_DURATION);
    }

    private cameraPositionHandler(pos: IPosition): void {
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

            this.moveCameraStates = of({
                x: pos.beta > 0
                    ? this.CAMERA_MOVEMENT_SENSITIVITY * sector[1]
                    : -this.CAMERA_MOVEMENT_SENSITIVITY * sector[1],
                y: pos.gamma > 0
                    ? -this.CAMERA_MOVEMENT_SENSITIVITY * sector[0]
                    : this.CAMERA_MOVEMENT_SENSITIVITY * sector[0],
                z: this.mapInfo.camera.rotation.enableRotationZ
                    ? (pos.alpha > 0 ? 1 : -1)
                    : 0
            });
        } else {
            this.moveCameraStates = of({
                x: 0,
                y: 0,
                z: this.mapInfo.camera.rotation.enableRotationZ
                    ? (pos.alpha > 0 ? 1 : -1)
                    : 0
            });
        }
    }

    // Initialize light

    private initLight(): void {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(-5, 5, -5);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(-5, 50, -5);

        const pointerLight = new THREE.PointLight(0xffffff, 0.2);
        pointerLight.position.set(0, 9, -5);

        this.scene.add(directionalLight, pointerLight, hemiLight);
    }

    // Initialize entities

    private initEntity(entity: canvasInterface.IEntity) {
        switch (entity.type) {
            case canvasInterface.entityTypeEnum.model:
                new ModelEntity(this.subjectName, this.map.name, entity)
                    .init(entity.modelType)
                    .subscribe((mesh: THREE.Mesh | THREE.Object3D) => {
                        this.scene.add(mesh);
                    });
                break;
            case canvasInterface.entityTypeEnum.cube:
                new CubeEntity(this.subjectName, this.map.name, entity)
                    .init()
                    .subscribe((mesh: THREE.Mesh | THREE.Object3D) => {
                        this.scene.add(mesh);
                    });
                break;
            case canvasInterface.entityTypeEnum.sphere:
                new SphereEntity(this.subjectName, this.map.name, entity)
                    .init()
                    .subscribe((mesh: THREE.Mesh | THREE.Object3D) => {
                        this.scene.add(mesh);
                    });
                break;
            case canvasInterface.entityTypeEnum.square:
                new SquareEntity(this.subjectName, this.map.name, entity)
                    .init()
                    .subscribe((mesh: THREE.Mesh | THREE.Object3D) => {
                        this.scene.add(mesh);
                    });
                break;
            case canvasInterface.entityTypeEnum.circle:
                new CircleEntity(this.subjectName, this.map.name, entity)
                    .init()
                    .subscribe((mesh: THREE.Mesh | THREE.Object3D) => {
                        this.scene.add(mesh);
                    });
                break;
            default:
                break;
        }
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
