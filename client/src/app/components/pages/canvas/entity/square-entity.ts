import { DoubleSide, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, MeshLambertMaterial, MeshLambertMaterialParameters, MeshPhongMaterial, MeshPhongMaterialParameters, MeshStandardMaterial, MeshStandardMaterialParameters, PlaneGeometry, Texture } from "three/src/Three";
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

    public init(): Observable<Mesh> {
        return new Observable((subscriber: Subscriber<Mesh>) => {
            const geometry = new PlaneGeometry(this.entity.scale.width, this.entity.scale.height);

            if (this.entity.texture) {
                loaderManager.texture(`${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.subjectTitle}/${this.entity.texture}`)
                    .subscribe((texture: Texture) => {
                        let material!: MeshBasicMaterial
                            | MeshStandardMaterial
                            | MeshPhongMaterial
                            | MeshLambertMaterial;

                        const materialOptions: MeshBasicMaterialParameters
                            | MeshStandardMaterialParameters
                            | MeshPhongMaterialParameters
                            | MeshLambertMaterialParameters = {
                                map: texture,
                                color: this.entity.color,
                                side: DoubleSide,
                            };

                        switch (this.entity.materialType) {
                        case canvasInterface.EntityMaterialTypeEnum.basic:
                            material = new MeshBasicMaterial(materialOptions);
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.standard:
                            material = new MeshStandardMaterial(materialOptions);
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.phong:
                            material = new MeshPhongMaterial(materialOptions);
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.phong_shininess:
                            material = new MeshPhongMaterial({ ...materialOptions, shininess: 100 });
                            break;
                        case canvasInterface.EntityMaterialTypeEnum.lambert:
                            material = new MeshLambertMaterial({ color: materialOptions.color });
                            break;
                        }

                        const mesh = new Mesh(geometry, material);

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
                let material!: MeshBasicMaterial
                    | MeshStandardMaterial
                    | MeshPhongMaterial
                    | MeshLambertMaterial;

                const materialOptions: MeshBasicMaterialParameters
                    | MeshStandardMaterialParameters
                    | MeshPhongMaterialParameters
                    | MeshLambertMaterialParameters = {
                        color: this.entity.color,
                        side: DoubleSide,
                    };

                switch (this.entity.materialType) {
                case canvasInterface.EntityMaterialTypeEnum.basic:
                    material = new MeshBasicMaterial(materialOptions);
                    break;
                case canvasInterface.EntityMaterialTypeEnum.standard:
                    material = new MeshStandardMaterial(materialOptions);
                    break;
                case canvasInterface.EntityMaterialTypeEnum.phong:
                    material = new MeshPhongMaterial(materialOptions);
                    break;
                case canvasInterface.EntityMaterialTypeEnum.phong_shininess:
                    material = new MeshPhongMaterial({ ...materialOptions, shininess: 100 });
                    break;
                case canvasInterface.EntityMaterialTypeEnum.lambert:
                    material = new MeshLambertMaterial({ color: materialOptions.color });
                    break;
                }

                const mesh = new Mesh(geometry, material);

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