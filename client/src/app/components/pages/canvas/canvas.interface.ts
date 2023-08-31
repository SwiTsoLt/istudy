export enum EntityTypeEnum {
    model = "model",
    cube = "cube",
    sphere = "sphere",
    square = "square",
    circle = "circle"
}

export type EntityType = EntityTypeEnum.model | EntityTypeEnum.cube | EntityTypeEnum.sphere | EntityTypeEnum.square | EntityTypeEnum.circle

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

export interface IEntity {
    title: string,
    type: EntityType,
    texture: string,
    model: string,
    credit: string,
    scale: IEntityScale,
    position: IEntityPosition,
    rotation: IEntityRotation
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
    background: THREE.ColorRepresentation,
    subject: string,
    camera: ICamera,
    scene: IEntity[]
}

export interface IWindowSize {
    width: number,
    height: number
}