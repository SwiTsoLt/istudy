import * as THREE from "three";
import * as canvasInterface from "../canvas.interface";

export class SquareEntity {

    constructor(
        private subjectName: string,
        private mapName: string,
        private entity: canvasInterface.IEntity,
    ) {
        this.entity = entity;
        this.subjectName = subjectName;
        this.mapName = mapName;
    }

    public init(): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(this.entity.scale.width, this.entity.scale.height);
        let texture: THREE.Texture | undefined;

        if (this.entity.texture) {
            texture = new THREE.TextureLoader()
                .load(`${canvasInterface.ASSET_PATH}/${this.subjectName}/${this.mapName}/${this.entity.texture}`);
        }

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

        return mesh;
    }
}