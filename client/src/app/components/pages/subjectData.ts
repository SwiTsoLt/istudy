import { ISelector } from "./room/subject/subject.component";

export const subjectData: { subjectList: ISelector[] } = {
    "subjectList": [
        {
            "title": "Алгебра",
            "name": "math",
            "imageName": "algebra.jpg",
            "childList": [
                {
                    "title": "Лодка",
                    "name": "boat",
                    "imageName": "boat.jpg",
                    "disabled": false,
                    "childList": []
                },
                {
                    "title": "Поезд",
                    "name": "train",
                    "imageName": "train.jpg",
                    "disabled": true,
                    "childList": []
                }
            ],
            "disabled": false
        },
        {
            "title": "Биология",
            "name": "biology",
            "imageName": "biology.jpg",
            "disabled": false,
            "childList": [
                {
                    "title": "Строение клетки",
                    "name": "cell",
                    "imageName": "cell.jpg",
                    "disabled": false,
                    "childList": []
                },
            ],
        },
        {
            "title": "Геометрия",
            "name": "geometry",
            "imageName": "geometry.jpg",
            "disabled": true,
            "childList": []
        },
        {
            "title": "Физика",
            "name": "physics",
            "imageName": "physics.jpg",
            "disabled": true,
            "childList": []
        },
        {
            "title": "Химия",
            "name": "chemistry",
            "imageName": "chemistry.jpg",
            "disabled": true,
            "childList": []
        },
        {
            "title": "Астрономия",
            "name": "astronomy",
            "imageName": "astronomy.jpg",
            "disabled": true,
            "childList": []
        }
    ]
};