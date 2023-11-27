import * as THREE from "three/src/Three";
import * as canvasInterface from "../canvas.interface";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Observable, Subscriber } from "rxjs";
import { loaderManager } from "../loaderManager";


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

    public init(modelType: canvasInterface.modelTypeEnum, animation: canvasInterface.IEntityAnimation): Observable<THREE.Object3D> {
        return new Observable((subscriber: Subscriber<THREE.Object3D>) => {
            switch (modelType) {
            case canvasInterface.modelTypeEnum.gltf:
                loaderManager.gltf(
                    `${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.mapName}/${this.entity.model}`,
                    animation
                )
                    .subscribe((gltf: GLTF) => {
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
                break;
            case canvasInterface.modelTypeEnum.glb:
                loaderManager.glb(
                    `${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.mapName}/${this.entity.model}`,
                    animation
                )
                    .subscribe((gltf: GLTF) => {
                        const mesh: THREE.Object3D = gltf.scene;

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
                break;
            case canvasInterface.modelTypeEnum.fbx:
                loaderManager.fbx(
                    `${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.mapName}/${this.entity.model}`,
                    animation
                )
                    .subscribe((anim: THREE.Group) => {
                        anim.position.x = this.entity.position.x;
                        anim.position.y = this.entity.position.y;
                        anim.position.z = this.entity.position.z;

                        anim.rotation.x = this.entity.rotation.x * Math.PI / 180;
                        anim.rotation.y = this.entity.rotation.y * Math.PI / 180;
                        anim.rotation.z = this.entity.rotation.z * Math.PI / 180;

                        anim.scale.set(this.entity.scale.width, this.entity.scale.height, this.entity.scale.depth);
                        anim.scale.multiplyScalar(this.entity.multiplyScalar);

                        subscriber.next(anim);
                    });
                break;

            case canvasInterface.modelTypeEnum.dae:
                loaderManager.dae(
                    `${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.mapName}/${this.entity.model}`
                )
                    .subscribe((anim: THREE.Mesh) => {

                        subscriber.next(anim);
                    });
                break;

            default:
                break;
            }
        });
    }
}