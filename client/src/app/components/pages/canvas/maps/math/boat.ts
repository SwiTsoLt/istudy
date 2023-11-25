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
        // {
        //     ...EntityDefaults,
        //     "title": "Boat",
        //     "type":  entityTypeEnum.model,
        //     "model": "boat/scene.gltf",
        //     "credit": "This work is based on \"Fishing boat\" (https://sketchfab.com/3d-models/fishing-boat-f4b38ccf5ffb46018aa7931c0e106654) by Pabooklas (https://sketchfab.com/Pabooklas) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
        //     "multiplyScalar": 2,
        //     "scale": {
        //         "width": 1,
        //         "height": 1,
        //         "depth": 1,
        //     },
        //     "position": {
        //         "x": 0,
        //         "y": 0,
        //         "z": -1
        //     },
        //     "rotation": {
        //         "x": -90,
        //         "y": 0,
        //         "z": 180
        //     }
        // },
        {
            ...EntityDefaults,
            "title": "Boat",
            "type":  entityTypeEnum.model,
            "model": "fboat/scene.gltf",
            "credit": "This work is based on \"Fishing boat\" (https://sketchfab.com/3d-models/fishing-boat-f4b38ccf5ffb46018aa7931c0e106654) by Pabooklas (https://sketchfab.com/Pabooklas) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
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
        // {
        //     ...EntityDefaults,
        //     "type": EntityTypeEnum.sphere,
        //     "materialType": EntityMaterialTypeEnum.phong_shininess,
        //     "color": 0x60EEFF,
        //     "scale": {
        //         "width": 0.1,
        //         "height": 10,
        //         "depth": 10,
        //     },
        //     "position": {
        //         "x": 0,
        //         "y": 0,
        //         "z": -1
        //     },
        //     "rotation": {
        //         "x": 30,
        //         "y": 30,
        //         "z": 0
        //     }
        // },
        // {
        //     ...EntityDefaults,
        //     "title": "Water",
        //     "type": entityTypeEnum.model,
        //     "credit": "This work is based on \"Water Animation\" (https://sketchfab.com/3d-models/water-animation-e54ff76bef854b128af8d20cf9c03729) by Artise1",
        //     "model": "water/scene.gltf",
        //     "modelType": modelTypeEnum.gltf,
        //     "scale": {
        //         "width": 2,
        //         "height": 2,
        //         "depth": 2,
        //     },
        //     "multiplyScalar": 0.01,
        //     "position": {
        //         "x": 0,
        //         "y": -3,
        //         "z": 9
        //     },
        //     "rotation": {
        //         "x": 90,
        //         "y": 0,
        //         "z": 0
        //     }
        // },
    ]
};