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
            "y": -1, // 0.7
            "z": 0
        },
        "rotation": {
            "x": -20,
            "y": 0,
            "z": 0,
            "enableRotationZ": false,
        }
    },
    "scene": [
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
                "y": -1.6,
                "z": -0.12
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
            "multiplyScalar": 0.03,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0.21,
                "y": -1.13,
                "z": -0.225
            },
            "rotation": {
                "x": -120,
                "y": 15,
                "z": 90
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
                "y": -1.03,
                "z": 0.3
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
                "y": -1.15,
                "z": 0.19
            },
            "rotation": {
                "x": 90,
                "y": 180,
                "z": 0
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
                "y": -1.1,
                "z": -0.22
            },
            "rotation": {
                "x": 90,
                "y": 180,
                "z": 20
            }

        },
        {
            ...canvasInterface.EntityDefaults,
            "title": "Tachometer",
            "type": canvasInterface.entityTypeEnum.model,
            "modelType": canvasInterface.modelTypeEnum.glb,
            "model": "sea/sea.glb",
            "credit": "This work is based on \"Trabant tachometer\" (https://sketchfab.com/3d-models/trabant-tachometer-2819c6fae8ac438eba43a35c2347d097) by takeboncog (https://sketchfab.com/takeboncog) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
            "multiplyScalar": 0.1,
            "scale": {
                "width": 50,
                "height": 1,
                "depth": 50
            },
            "position": {
                "x": 0,
                "y": -2,
                "z": 0
            },
            "rotation": {
                "x": 0,
                "y": 0,
                "z": 0
            }
        },
        // {
        //     ...canvasInterface.EntityDefaults,
        //     "title": "Sea",
        //     "texture": "sea/sea.jpg",
        //     "scale": {
        //         "width": 50,
        //         "height": 50,
        //         "depth": 0
        //     },
        //     "position": {
        //         "x": 0,
        //         "y": -1,
        //         "z": 0
        //     },
        //     "rotation": {
        //         "x": -90,
        //         "y": 0,
        //         "z": 0
        //     }
        // },
        // {
        //     ...canvasInterface.EntityDefaults,
        //     "title": "Sea",
        //     "type":  canvasInterface.entityTypeEnum.model,
        //     "model": "sea/Water.glb",
        //     "modelType": canvasInterface.modelTypeEnum.glb,
        //     "credit": "This work is based on \"Trabant tachometer\" (https://sketchfab.com/3d-models/trabant-tachometer-2819c6fae8ac438eba43a35c2347d097) by takeboncog (https://sketchfab.com/takeboncog) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
        //     "multiplyScalar": 2,
        //     "scale": {
        //         "width": 1,
        //         "height": 1,
        //         "depth": 1,
        //     },
        //     "position": {
        //         "x": 0,
        //         "y": -4,
        //         "z": 0
        //     },
        //     "rotation": {
        //         "x": 180,
        //         "y": 0,
        //         "z": 0
        //     }
        // },
        {
            ...canvasInterface.EntityDefaults,
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
            ...canvasInterface.EntityDefaults,
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
            ...canvasInterface.EntityDefaults,
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
            ...canvasInterface.EntityDefaults,
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