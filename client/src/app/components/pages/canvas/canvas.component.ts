import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import * as THREE from "three";
import { IPosition } from "../../pages/controller/controller.service";
import * as canvasSelectors from "../../../store/canvas-store/canvas.selector";
import { ISelector } from "../room/subject/subject.component";
import { EntityTypeEnum, ICamera, IEntity, IMapData, IWindowSize } from "./canvas.interface";
import { mapsData } from "./maps";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { subjectData } from "../subjectData";
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

    private map: ISelector = { title: "", name: "", imageName: "", disabled: true, childList: [] };
    private subjectName: string = "math";

    private readonly ASSET_PATH = "/app/media/canvas/assets";

    private renderer!: THREE.WebGLRenderer;
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private windowSize: IWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    private loaderGLTF: GLTFLoader = new GLTFLoader();

    private fieldOfView: number = 50;
    private nearClippingPlane: number = 0.1;
    private farClippingPlane: number = 100;

    private directionalLight!: THREE.DirectionalLight;
    private pointLight!: THREE.PointLight;

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
        const mapInfo: IMapData = mapsData[this.subjectName][this.map.name];
        this.createScene(mapInfo);

        window.addEventListener("resize", () => {
            this.createScene(mapInfo);
        });
    }

    createScene(mapInfo: IMapData): void {
        this.setCanvasSize();

        this.scene = new THREE.Scene();

        this.initPerspectiveCamera(mapInfo.camera);
        this.cameraPosition$.subscribe((pos: IPosition) => this.cameraPositionHandler(pos, this.camera));
        this.initLight();

        mapInfo.scene.forEach((entity: IEntity) => {
            this.initEntity(entity);
        });

        this.initRenderer();
        
        if (mapInfo.background) {
            this.scene.background = new THREE.Color(mapInfo.background);
        } else {
            this.renderer.setClearColor(0x000000, 0);
        }

        this.render();
    }

    private setCanvasSize(): void {
        this.windowSize.width = window.innerWidth;
        this.windowSize.height = window.innerHeight;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";
    }

    private initEntity(entity: IEntity) {
        switch (entity.type) {
        case EntityTypeEnum.model:
            this.initModel(entity);
            break;
        case EntityTypeEnum.square:
            this.initSquare(entity);
            break;
        case EntityTypeEnum.circle:
            this.initCircle(entity);
            break;
        case EntityTypeEnum.cube:
            this.initCube(entity);
            break;
        default:
            break;
        }
    }

    private initSquare(entity: IEntity) {
        const geometry = new THREE.PlaneGeometry(entity.scale.width, entity.scale.height);

        let texture: THREE.Texture | undefined;

        if (entity.texture) {
            texture = new THREE.TextureLoader()
                .load(`${this.ASSET_PATH}/${this.subjectName}/${this.map.name}/${entity.texture}`);
        }

        const material = new THREE.MeshBasicMaterial({ map: texture, color: entity.color, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);

        plane.position.set(
            entity.position.x,
            entity.position.y,
            entity.position.z
        );
        plane.rotation.set(
            entity.rotation.x * Math.PI / 180,
            entity.rotation.y * Math.PI / 180,
            entity.rotation.z * Math.PI / 180
        );
        console.log(plane.rotation);
        this.scene.add(plane);
    }

    private initCircle(entity: IEntity) {
        const geometry = new THREE.CircleGeometry(entity.scale.width, entity.scale.height);

        let texture: THREE.Texture | undefined;

        if (entity.texture) {
            texture = new THREE.TextureLoader()
                .load(`${this.ASSET_PATH}/${this.subjectName}/${this.map.name}/${entity.texture}`);
        }

        const material = new THREE.MeshBasicMaterial({ map: texture, color: entity.color, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);

        plane.position.set(
            entity.position.x,
            entity.position.y,
            entity.position.z
        );
        plane.rotation.set(
            entity.rotation.x * Math.PI / 180,
            entity.rotation.y * Math.PI / 180,
            entity.rotation.z * Math.PI / 180
        );
        this.scene.add(plane);
    }

    private initCube(entity: IEntity) {
        const geometry = new THREE.BoxGeometry(entity.scale.width, entity.scale.height, entity.scale.depth);
        const material = new THREE.MeshStandardMaterial({ color: entity.color, roughness: 0 });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.set(entity.position.x, entity.position.y, entity.position.z);
        cube.rotation.set(entity.rotation.x * Math.PI / 180, entity.rotation.y * Math.PI / 180, entity.rotation.z * Math.PI / 180);

        this.scene.add(cube);
    }

    private initModel(entity: IEntity) {
        this.loaderGLTF.load(`${this.ASSET_PATH}/${this.subjectName}/${this.map.name}/${entity.model}/scene.gltf`, (gltf: GLTF) => {
            const model = gltf.scene.children[0];

            model.position.x = entity.position.x;
            model.position.y = entity.position.y;
            model.position.z = entity.position.z;

            model.rotation.x = entity.rotation.x * Math.PI / 180;
            model.rotation.y = entity.rotation.y * Math.PI / 180;
            model.rotation.z = entity.rotation.z * Math.PI / 180;

            model.scale.multiplyScalar(entity.multiplyScalar);

            this.scene.add(model);
        });
    }

    private initPerspectiveCamera(options: ICamera): void {
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

    private initLight(): void {
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(-4, 20, -2);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(3, 3, -1);
        this.scene.add(light, directionalLight);
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

    private initRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;
    }

    private render() {
        const rend = () => {
            requestAnimationFrame(rend);
            this.renderer.render(this.scene, this.camera);
        };
        rend();
    }
}
