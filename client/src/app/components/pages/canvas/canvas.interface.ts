import { CircleEntity } from "./entity/circle-entity";
import { CubeEntity } from "./entity/cube-entity";
import { ModelEntity } from "./entity/model-entity";
import { SphereEntity } from "./entity/sphere-entity";
import { SquareEntity } from "./entity/square-entity";
import { ColorRepresentation, Group, Mesh } from "three/src/Three";

export const ASSET_PATH = "/app/media/canvas/assets";

export enum entityTypeEnum {
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

export type EntityType = entityTypeEnum.model | entityTypeEnum.cube | entityTypeEnum.sphere | entityTypeEnum.square | entityTypeEnum.circle;
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

export enum modelTypeEnum {
    gltf = "gltf",
    glb = "glb",
    fbx = "fbx",
    dae = "dae",
}

export const EntityDefaults: Pick<
IEntity, "title" | "type" | "texture" | "materialType"
| "color" | "model" | "modelType" | "credit" | "multiplyScalar"
| "animation" | "scale" | "position" | "rotation"
> = {
    title: "unknown_map",
    type: entityTypeEnum.square,
    texture: "",
    materialType: EntityMaterialTypeEnum.basic,
    color: 0xFFFFFF,
    model: "",
    modelType: modelTypeEnum.gltf,
    credit: "",
    multiplyScalar: 1,
    animation: {
        rate: 1,
        stopAt: null,
    },
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

export interface IEntityAnimation {
    rate: number,
    stopAt: number | null,
}

export interface IEntity {
    title: string,
    type: EntityType,
    texture: string,
    materialType: EntityMaterialType,
    color: ColorRepresentation,
    model: string,
    modelType: modelTypeEnum,
    credit: string,
    multiplyScalar: number,
    animation: IEntityAnimation, 
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
    z: number,
    enableRotationZ: boolean
}

export interface ICamera {
    position: ICameraPosition,
    rotation: ICameraRotation,
}

export interface IMoveCameraStates {
    x: number,
    y: number,
    z: number,
}

export interface IMapAudio {
    path: string,
    volume: number,
    interval: number,
    loop: boolean,
}

export interface IMapTaskInfoField {
    title: string,
    placeholder: string,
}

export interface IMapTaskInfo {
    question: string,
    fields: IMapTaskInfoField[],
    answer: string
}

export interface IMapData {
    title: string,
    map: string,
    taskInfo: IMapTaskInfo,
    background: ColorRepresentation | undefined,
    backgroundImage: string | null,
    subject: string,
    camera: ICamera,
    audio: IMapAudio[] | null,
    scene: IEntity[]
}

export interface IWindowSize {
    width: number,
    height: number
}

export interface IEntityBasicCallback {
    mesh: Mesh,
}

export interface IEntityModelCallback {
    group: Group,
    animationCallback: () => void
}

export type EntityClassType = ModelEntity | CubeEntity | SphereEntity | SquareEntity | CircleEntity