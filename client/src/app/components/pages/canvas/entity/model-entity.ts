import * as THREE from "three";
import * as canvasInterface from "../canvas.interface";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Observable, Subscriber } from "rxjs";

export class ModelEntity {

    constructor(
        private subjectName: string,
        private mapName: string,
        private entity: canvasInterface.IEntity,
    ) {
        this.entity = entity;
        this.subjectName = subjectName;
        this.mapName = mapName;
    }

    private readonly loaderGLTF: GLTFLoader = new GLTFLoader();

    public init(): Observable<THREE.Object3D> {
        return new Observable((subscriber: Subscriber<THREE.Object3D>) => {
            this.loaderGLTF.load(`${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.mapName}/${this.entity.model}/scene.gltf`, (gltf: GLTF) => {
                const mesh: THREE.Object3D = gltf.scene.children[0];

                mesh.position.x = this.entity.position.x;
                mesh.position.y = this.entity.position.y;
                mesh.position.z = this.entity.position.z;

                mesh.rotation.x = this.entity.rotation.x * Math.PI / 180;
                mesh.rotation.y = this.entity.rotation.y * Math.PI / 180;
                mesh.rotation.z = this.entity.rotation.z * Math.PI / 180;

                mesh.scale.set(this.entity.scale.width, this.entity.scale.height, this.entity.scale.depth);
                mesh.scale.multiplyScalar(this.entity.multiplyScalar);
                
                subscriber.next(mesh);
            });
        });
    }
}