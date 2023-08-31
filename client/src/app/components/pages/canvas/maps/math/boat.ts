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
            "texture": "boat",
            "model": "boat",
            "credit": "This work is based on \"Fishing boat\" (https://sketchfab.com/3d-models/fishing-boat-f4b38ccf5ffb46018aa7931c0e106654) by Pabooklas (https://sketchfab.com/Pabooklas) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
            "scale": {
                "width": 100,
                "height": 100,
                "depth": 100
            },
            "position": {
                "x": 0,
                "y": 0,
                "z": -10
            },
            "rotation": {
                "x": -90,
                "y": 0,
                "z": 180
            }
        }
    ]
}