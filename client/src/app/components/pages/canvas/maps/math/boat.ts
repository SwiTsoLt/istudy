import { EntityTypeEnum, IMapData } from "../../canvas.interface";

export const map: IMapData = {
    "title": "Boat",
    "map": "boat",
    "background": 0xe3f2fd,
    "subject": "math",
    "camera": {
        "position": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "rotation": {
            "x": 0,
            "y": 0,
            "z": 0
        }
    },
    "scene": [
        {
            "title": "Boat",
            "type":  EntityTypeEnum.model,
            "texture": "boat2",
            "model": "boat",
            "credit": "This work is based on \"Fishing boat\" (https://sketchfab.com/3d-models/fishing-boat-f4b38ccf5ffb46018aa7931c0e106654) by Pabooklas (https://sketchfab.com/Pabooklas) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
            "multiplyScalar": 100,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1
            },
            "position": {
                "x": 0,
                "y": 0,
                "z": -10000
            },
            "rotation": {
                "x": -90,
                "y": 0,
                "z": 0
            }
        }
    ]
}