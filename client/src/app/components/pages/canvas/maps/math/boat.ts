import { entityTypeEnum, IMapData, EntityDefaults, EntityMaterialTypeEnum, modelTypeEnum } from "../../canvas.interface";

export const map: IMapData = {
    "title": "Boat",
    "map": "boat",
    "background": 0xFFA900,
    "subject": "math",
    "camera": {
        "position": {
            "x": 0,
            "y": 0.15,
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
            "credit": "This work is based on \"Fishing boat\" (https://sketchfab.com/3d-models/fishing-boat-f4b38ccf5ffb46018aa7931c0e106654) by Pabooklas (https://sketchfab.com/Pabooklas) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
            "multiplyScalar": 2,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
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
        // {
        //     ...EntityDefaults,
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
        {
            ...EntityDefaults,
            "title": "Sky 1 (Sun)",
            "texture": "sun/sun.png",
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
        },
        {
            ...EntityDefaults,
            "title": "Sky 2",
            "texture": "sun/sky.png",
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
            ...EntityDefaults,
            "title": "Sky 3",
            "texture": "sun/sky.png",
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
            ...EntityDefaults,
            "title": "Sky 4",
            "texture": "sun/sky.png",
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
        {
            ...EntityDefaults,
            "title": "Water",
            "type": entityTypeEnum.model,
            "credit": "This work is based on \"Water Animation\" (https://sketchfab.com/3d-models/water-animation-e54ff76bef854b128af8d20cf9c03729) by Artise1",
            "model": "water/scene.gltf",
            "modelType": modelTypeEnum.gltf,
            "scale": {
                "width": 2,
                "height": 2,
                "depth": 2,
            },
            "multiplyScalar": 0.01,
            "position": {
                "x": 0,
                "y": -3,
                "z": 9
            },
            "rotation": {
                "x": 90,
                "y": 0,
                "z": 0
            }
        },
    ]
};