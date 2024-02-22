import * as canvasInterface from "../../canvas.interface";

export const map: canvasInterface.IMapData = {
    "title": "Boat",
    "map": "boat",
    "taskInfo": {
        "question": "Соотнесите определения с объектами",
        "answer": "",
        "fields": []
    },
    "background": 0xBBFFBB,
    "backgroundImage": null,
    "audio": [],
    "subject": "math",
    "camera": {
        "position": {
            "x": 0,
            "y": 0,
            "z": 3
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
            "title": "Cell",
            "type": canvasInterface.entityTypeEnum.model,
            "model": "cell/scene.gltf",
            "modelType": canvasInterface.modelTypeEnum.gltf,
            "materialType": canvasInterface.EntityMaterialTypeEnum.phong_shininess,
            "credit": "",
            "multiplyScalar": 0.01,
            "scale": {
                "width": 1,
                "height": 1,
                "depth": 1,
            },
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "rotation": {
                "x": -60,
                "y": 0,
                "z": 90
            }
        },
    ]
};