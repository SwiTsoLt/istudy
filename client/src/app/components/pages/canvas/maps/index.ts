import { IMapData } from "../canvas.interface";
import * as boatMap from "./math/boat";
import * as cellMap from "./biology/cell";

interface IMapPath {
    [mapName: string]: IMapData
}

interface ISubjectPath {
    [subjectName: string]: IMapPath
}

export const mapsData: ISubjectPath = {
    "math": {
        "boat": boatMap.map,
    },
    "biology": {
        "cell": cellMap.map,
    }
};