export const ASSET_PATH = "/app/media/canvas/assets";

export enum EntityTypeEnum {
    model = "model",
    cube = "cube",
    sphere = "sphere",
    square = "square",
    circle = "circle"
}

export enum EntityMaterialTypeEnum {
    basic = "basic",
    standard = "standard",
    phong = "phong",
    phong_shininess = "phong_shininess",
    lambert = "lambert"
}

export type EntityType = EntityTypeEnum.model | EntityTypeEnum.cube | EntityTypeEnum.sphere | EntityTypeEnum.square | EntityTypeEnum.circle;
export type EntityMaterialType = EntityMaterialTypeEnum.basic | EntityMaterialTypeEnum.standard | EntityMaterialTypeEnum.phong | EntityMaterialTypeEnum.phong_shininess | EntityMaterialTypeEnum.lambert;

export interface IEntityRotation {
    x: number,
    y: number,
    z: number
}

export interface IEntityPosition {
    x: number,
    y: number,
    z: number
}

export interface IEntityScale {
    width: number,
    height: number,
    depth: number
}

export const EntityDefaults: Pick<
IEntity, "title" | "type" | "texture" | "materialType"
| "color" | "model" | "credit" | "multiplyScalar"
| "scale" | "position" | "rotation"
> = {
    title: "unknown_map",
    type: EntityTypeEnum.square,
    texture: "",
    materialType: EntityMaterialTypeEnum.basic,
    color: 0xFFFFFF,
    model: "",
    credit: "",
    multiplyScalar: 1,
    scale: {
        width: 1,
        height: 1,
        depth: 1,
    },
    position: {
        x: 0,
        y: 0,
        z: 0,
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0,
    }
};

export interface IEntity {
    title: string,
    type: EntityType,
    texture: string,
    materialType: EntityMaterialType,
    color: THREE.ColorRepresentation,
    model: string,
    credit: string,
    multiplyScalar: number,
    scale: IEntityScale,
    position: IEntityPosition,
    rotation: IEntityRotation,
}

export interface ICameraPosition {
    x: number,
    y: number,
    z: number
}

export interface ICameraRotation {
    x: number,
    y: number,
    z: number
}

export interface ICamera {
    position: ICameraPosition,
    rotation: ICameraRotation
}

export interface IMapData {
    title: string,
    map: string,
    background: THREE.ColorRepresentation | undefined,
    subject: string,
    camera: ICamera,
    scene: IEntity[]
}

export interface IWindowSize {
    width: number,
    height: number
}