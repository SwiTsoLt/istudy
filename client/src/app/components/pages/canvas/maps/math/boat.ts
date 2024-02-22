import * as canvasInterface from "../../canvas.interface";

export const map: canvasInterface.IMapData = {
    "title": "Boat",
    "map": "boat",
    "taskInfo": {
        "question": "В какое время рыбак приплывет домой?",
        "answer": "17:15",
        "fields": [
            { "title": "Путь", "placeholder": "10 км" },
            { "title": "Скорость     ", "placeholder": "20 км/ч" },
            { "title": "Текущее время", "placeholder": "12:34" },
        ]
    },
    "background": 0x1F8DFC,
    "backgroundImage": null,
    "audio": [
        {
            "path": "ocean.mp3",
            "volume": 50,
            "interval": 0,
            "loop": true,
        },
        {
            "path": "gull.mp3",
            "volume": 10,
            "interval": 32000,
            "loop": true,
        },
        {
            "path": "scenario.mp3",
            "volume": 100,
            "interval": 1000,
            "loop": false,
        }
    ],
    "subject": "math",
    "camera": {
        "position": {
            "x": 0,
            "y": 2.1, // 3
            "z": 0.13
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
            ...canvasInterface.EntityDefaults,
            "title": "Island",
            "type": canvasInterface.entityTypeEnum.model,
            "modelType": canvasInterface.modelTypeEnum.glb,
            "model": "island2/island.glb",
            "multiplyScalar": 2,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 15,
                "y": 1,
                "z": 1
            },
            "rotation": {
                "x": 0,
                "y": -45,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Island",
            "type": canvasInterface.entityTypeEnum.model,
            "modelType": canvasInterface.modelTypeEnum.glb,
            "model": "island/island.glb",
            "multiplyScalar": 0.2,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": -30,
                "y": 1,
                "z": -1
            },
            "rotation": {
                "x": 0,
                "y": 110,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Seagull fly",
            "type": canvasInterface.entityTypeEnum.model,
            "modelType": canvasInterface.modelTypeEnum.glb,
            "model": "seagull_fly/seagull.glb",
            "multiplyScalar": 0.01,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": -1,
                "y": 3,
                "z": -1
            },
            "rotation": {
                "x": 0,
                "y": -20,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Seagull sit",
            "type": canvasInterface.entityTypeEnum.model,
            "modelType": canvasInterface.modelTypeEnum.glb,
            "model": "seagull_sit/seagull.glb",
            "multiplyScalar": 0.0015,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0.13,
                "y": 1.996,
                "z": -0.3
            },
            "rotation": {
                "x": 0,
                "y": -20,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Boat",
            "type": canvasInterface.entityTypeEnum.model,
            "model": "boat/scene.gltf",
            "credit": "This work is based on \"Fishing Boat\" (https://sketchfab.com/3d-models/fishing-boat-e07c8b9cc38543879a4e2fe145e62df6) by JasperTobias (https://sketchfab.com/JasperTobias) licensed under CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)",
            "multiplyScalar": 0.005,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0,
                "y": 1.5,
                "z": 0
            },
            "rotation": {
                "x": -90,
                "y": 0,
                "z": 180
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Map",
            "type": canvasInterface.entityTypeEnum.model,
            "model": "map/scene.gltf",
            "modelType": canvasInterface.modelTypeEnum.gltf,
            "multiplyScalar": 0.028,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0.2,
                "y": 1.98,
                "z": -0.1
            },
            "rotation": {
                "x": -120,
                "y": 15,
                "z": 90
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Way",
            "texture": "way/way.png",
            "type": canvasInterface.entityTypeEnum.circle,
            "multiplyScalar": 0.015,
            "scale": {
                "width": 1.5,
                "height": 32,
                "depth": 0,
            },
            "position": {
                "x": 0.1,
                "y": 2.004,
                "z": -0.11
            },
            "rotation": {
                "x": -75,
                "y": 10,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Clock",
            "type": canvasInterface.entityTypeEnum.model,
            "model": "clock/clock.glb",
            "modelType": canvasInterface.modelTypeEnum.glb,
            "multiplyScalar": 0.3,
            "animation": {
                "speed": 100,
                "rate": 0.0694445,
                "stopAt": (3 * 12) + 9
            },
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0,
                "y": 2.05,
                "z": 0.46
            },
            "rotation": {
                "x": 0,
                "y": 180,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Tachometer",
            "type": canvasInterface.entityTypeEnum.model,
            "model": "tachometer/scene.gltf",
            "modelType": canvasInterface.modelTypeEnum.gltf,
            "credit": "This work is based on \"Trabant tachometer\" (https://sketchfab.com/3d-models/trabant-tachometer-2819c6fae8ac438eba43a35c2347d097) by takeboncog (https://sketchfab.com/takeboncog) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
            "multiplyScalar": 0.03,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0,
                "y": 1.95,
                "z": 0.31
            },
            "rotation": {
                "x": 90,
                "y": 180,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Ocean",
            "type": canvasInterface.entityTypeEnum.model,
            "model": "ocean/ocean.glb",
            "modelType": canvasInterface.modelTypeEnum.glb,
            "credit": "This work created by Fyodr Semerenko",
            "multiplyScalar": 2,
            "scale": {
                "width": 1,
                "height": 0.5,
                "depth": 1,
            },
            "position": {
                "x": -4,
                "y": 1,
                "z": 0
            },
            "rotation": {
                "x": 0,
                "y": -90,
                "z": 0
            }
        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Sky",
            "type": canvasInterface.entityTypeEnum.model,
            "model": "sky/sky.glb",
            "modelType": canvasInterface.modelTypeEnum.glb,
            "credit": "",
            "multiplyScalar": 80,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": -70,
                "y": -30,
                "z": -10
            },
            "rotation": {
                "x": 0,
                "y": -90,
                "z": 0
            }
        },
    ]
};