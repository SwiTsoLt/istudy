import { EntityTypeEnum, IMapData } from "../../canvas.interface";

export const map: IMapData = {
    "title": "Boat",
    "map": "boat",
    "background": 0xFFA900,
    "subject": "math",
    "camera": {
        "position": {
            "x": 0,
            "y": 0.1,
            "z": 0
        },
        "rotation": {
            "x": 0,
            "y": -170,
            "z": 0
        }
    },
    "scene": [
        {
            "title": "Boat",
            "type":  EntityTypeEnum.model,
            "texture": "",
            color: 0xEEEEEE,
            "model": "boat",
            "credit": "This work is based on \"Fishing boat\" (https://sketchfab.com/3d-models/fishing-boat-f4b38ccf5ffb46018aa7931c0e106654) by Pabooklas (https://sketchfab.com/Pabooklas) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
            "multiplyScalar": 1,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1
            },
            "position": {
                "x": 0,
                "y": 0,
                "z": -1 
            },
            "rotation": {
                "x": -90,
                "y": 0,
                "z": 180
            }
        },
        {
            "title": "Sea",
            "type": EntityTypeEnum.square,
            "texture": "sea/sea.jpg",
            "model": "",
            "credit": "",
            "color": 0xffffff,
            "multiplyScalar": 1,
            "scale": {
                "width": 50,
                "height": 50,
                "depth": 0
            },
            "position": {
                "x": 0,
                "y": -1,
                "z": 0
            },
            "rotation": {
                "x": -90,
                "y": 0,
                "z": 0
            }

        },
        {
            "title": "Sky 1 (Sun)",
            "type": EntityTypeEnum.square,
            "texture": "sun/sun2.png",
            "model": "",
            "credit": "",
            "color": 0xffffff,
            "multiplyScalar": 1,
            "scale": {
                "width": 140,
                "height": 30,
                "depth": 0
            },
            "position": {
                "x": 0,
                "y": 10,
                "z": -49
            },
            "rotation": {
                "x": 0,
                "y": 0,
                "z": 0
            }
        },
        {
            "title": "Sky 2",
            "type": EntityTypeEnum.square,
            "texture": "sun/sky.png",
            "model": "",
            "credit": "",
            "color": 0xffffff,
            "multiplyScalar": 1,
            "scale": {
                "width": 140,
                "height": 30,
                "depth": 0
            },
            "position": {
                "x": -49,
                "y": 10,
                "z": 0
            },
            "rotation": {
                "x": 0,
                "y": 90,
                "z": 0
            }
        },
        {
            "title": "Sky 3",
            "type": EntityTypeEnum.square,
            "texture": "sun/sky.png",
            "model": "",
            "credit": "",
            "color": 0xffffff,
            "multiplyScalar": 1,
            "scale": {
                "width": 140,
                "height": 30,
                "depth": 0
            },
            "position": {
                "x": 49,
                "y": 10,
                "z": 0
            },
            "rotation": {
                "x": 0,
                "y": -90,
                "z": 0
            }
        },
        {
            "title": "Sky 4",
            "type": EntityTypeEnum.square,
            "texture": "sun/sky.png",
            "model": "",
            "credit": "",
            "color": 0xffffff,
            "multiplyScalar": 1,
            "scale": {
                "width": 140,
                "height": 30,
                "depth": 0
            },
            "position": {
                "x": 0,
                "y": 10,
                "z": 49
            },
            "rotation": {
                "x": 0,
                "y": -180,
                "z": 0
            }
        },
        // {
        //     "title": "Cube",
        //     "type": EntityTypeEnum.cube,
        //     "texture": "",
        //     "model": "",
        //     "credit": "",
        //     "color": 0x00ff00,
        //     "multiplyScalar": 1,
        //     "scale": {
        //         "width": 0.2,
        //         "height": 0.2,
        //         "depth": 0.2
        //     },
        //     "position": {
        //         "x": 0,
        //         "y": 0,
        //         "z": -2
        //     },
        //     "rotation": {
        //         "x": -10,
        //         "y": 30,
        //         "z": 0
        //     }
        // }
    ]
};