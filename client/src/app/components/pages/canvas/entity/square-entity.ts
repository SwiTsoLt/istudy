import * as THREE from "three/src/Three";
import * as canvasInterface from "../canvas.interface";
import { loaderManager } from "../loaderManager";
import { Observable, Subscriber } from "rxjs";

export class SquareEntity {

    constructor(
        private subjectName: string,
        private subjectTitle: string,
        private entity: canvasInterface.IEntity,
    ) {
        this.entity = entity;
        this.subjectName = subjectName;
        this.subjectTitle = subjectTitle;
    }

    public init(): Observable<THREE.Mesh | THREE.Group> {
        return new Observable((subscriber: Subscriber<THREE.Mesh | THREE.Group>) => {
            const geometry = new THREE.PlaneGeometry(this.entity.scale.width, this.entity.scale.height);

            if (this.entity.texture) {
                loaderManager.texture(`${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.subjectTitle}/${this.entity.texture}`)
                    .subscribe((texture: THREE.Texture) => {
                        let material!: THREE.MeshBasicMaterial
                            | THREE.MeshStandardMaterial
                            | THREE.MeshPhongMaterial
                            | THREE.MeshLambertMaterial;

                        const materialOptions: THREE.MeshBasicMaterialParameters
                            | THREE.MeshStandardMaterialParameters
                            | THREE.MeshPhongMaterialParameters
                            | THREE.MeshLambertMaterialParameters = {
                                map: texture,
                                color: this.entity.color,
                                side: THREE.DoubleSide,
                            };

                        switch (this.entity.materialType) {
                        case canvasInterface.EntityMaterialTypeEnum.basic:
                            material = new THREE.MeshBasicMaterial(materialOptions);
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.standard:
                            material = new THREE.MeshStandardMaterial(materialOptions);
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.phong:
                            material = new THREE.MeshPhongMaterial(materialOptions);
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.phong_shininess:
                            material = new THREE.MeshPhongMaterial({ ...materialOptions, shininess: 100 });
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.lambert:
                            material = new THREE.MeshLambertMaterial({ color: materialOptions.color });
                            break;
                        }

                        const mesh = new THREE.Mesh(geometry, material);

                        mesh.scale.multiplyScalar(this.entity.multiplyScalar);

                        mesh.position.set(
                            this.entity.position.x,
                            this.entity.position.y,
                            this.entity.position.z
                        );
                        mesh.rotation.set(
                            this.entity.rotation.x * Math.PI / 180,
                            this.entity.rotation.y * Math.PI / 180,
                            this.entity.rotation.z * Math.PI / 180
                        );

                        subscriber.next(mesh);
                    });
            } else {
                let material!: THREE.MeshBasicMaterial
                    | THREE.MeshStandardMaterial
                    | THREE.MeshPhongMaterial
                    | THREE.MeshLambertMaterial;

                const materialOptions: THREE.MeshBasicMaterialParameters
                    | THREE.MeshStandardMaterialParameters
                    | THREE.MeshPhongMaterialParameters
                    | THREE.MeshLambertMaterialParameters = {
                        color: this.entity.color,
                        side: THREE.DoubleSide,
                    };

                switch (this.entity.materialType) {
                case canvasInterface.EntityMaterialTypeEnum.basic:
                    material = new THREE.MeshBasicMaterial(materialOptions);
                    break;
                case canvasInterface.EntityMaterialTypeEnum.standard:
                    material = new THREE.MeshStandardMaterial(materialOptions);
                    break;
                case canvasInterface.EntityMaterialTypeEnum.phong:
                    material = new THREE.MeshPhongMaterial(materialOptions);
                    break;
                case canvasInterface.EntityMaterialTypeEnum.phong_shininess:
                    material = new THREE.MeshPhongMaterial({ ...materialOptions, shininess: 100 });
                    break;
                case canvasInterface.EntityMaterialTypeEnum.lambert:
                    material = new THREE.MeshLambertMaterial({ color: materialOptions.color });
                    break;
                }

                const mesh = new THREE.Mesh(geometry, material);

                mesh.scale.multiplyScalar(this.entity.multiplyScalar);

                mesh.position.set(
                    this.entity.position.x,
                    this.entity.position.y,
                    this.entity.position.z
                );
                mesh.rotation.set(
                    this.entity.rotation.x * Math.PI / 180,
                    this.entity.rotation.y * Math.PI / 180,
                    this.entity.rotation.z * Math.PI / 180
                );

                subscriber.next(mesh);
            }
        });
    }
}