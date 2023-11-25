import { entityTypeEnum, IMapData, EntityDefaults } from "../../canvas.interface";

export const map: IMapData = {
    "title": "Boat",
    "map": "boat",
    "background": 0x55c1ff,
    "backgroundImage": null,
    "audio": [
        {
            "path": "ocean.mp3",
            "volume": 50,
            "interval": 100000,
            "loop": true,
        },
        {
            "path": "gull.mp3",
            "volume": 50,
            "interval": 22000,
            "loop": true,
        },
        {
            "path": "scenario.mp3",
            "volume": 50,
            "interval": 1000,
            "loop": false,
        }
    ],
    "subject": "math",
    "camera": {
        "position": {
            "x": 0,
            "y": 0.5,
            "z": 0
        },
        "rotation": {
            "x": 0,
            "y": 0,
            "z": 0,
            "enableRotationZ": false,
        }
    },
    "scene": [
        {
            ...EntityDefaults,
            "title": "Boat",
            "type":  entityTypeEnum.model,
            "model": "boat/scene.gltf",
            "credit": "This work is based on \"Fishing Boat\" (https://sketchfab.com/3d-models/fishing-boat-e07c8b9cc38543879a4e2fe145e62df6) by JasperTobias (https://sketchfab.com/JasperTobias) licensed under CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)",
            "multiplyScalar": 0.015,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0,
                "y": -1.5,
                "z": -0.12
            },
            "rotation": {
                "x": -90,
                "y": 0,
                "z": 180
            }
        },
        {
            ...EntityDefaults,
            "title": "Sea",
            "texture": "sea/sea.jpg",
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
            ...EntityDefaults,
            "title": "Sky 1",
            "texture": "sky/sky.jpg",
            "scale": {
                "width": 60,
                "height": 50,
                "depth": 0
            },
            "position": {
                "x": 0,
                "y": 0,
                "z": -28
            },
        },
        {
            ...EntityDefaults,
            "title": "Sky 2",
            "texture": "sky/sky.jpg",
            "scale": {
                "width": 60,
                "height": 50,
                "depth": 0
            },
            "position": {
                "x": 0,
                "y": 0,
                "z": 28
            },
            "rotation": {
                "x": 0,
                "y": 180,
                "z": 0
            }
        },
        {
            ...EntityDefaults,
            "title": "Sky 3",
            "texture": "sky/sky.jpg",
            "scale": {
                "width": 60,
                "height": 50,
                "depth": 0
            },
            "position": {
                "x": -28,
                "y": 0,
                "z": 0
            },
            "rotation": {
                "x": 0,
                "y": -90,
                "z": 0
            }
        },
        {   
            ...EntityDefaults,
            "title": "Sky 4",
            "texture": "sky/sky.jpg",
            "scale": {
                "width": 60,
                "height": 50,
                "depth": 0
            },
            "position": {
                "x": 28,
                "y": 0,
                "z": 0
            },
            "rotation": {
                "x": 0,
                "y": 90,
                "z": 0
            }
        },
    ]
};