import { Component, OnInit } from "@angular/core";
import { ControllerService, IPosition } from "./controller.service";
import { WebRtcService } from "../../../webrtc.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as webRtcInterface from "../../../store/webrtc-store/webrtc.interface";
import { subjectData } from "../subjectData";
import { ISelector } from "../room/subject/subject.component";
import * as canvasInterface from "../canvas/canvas.interface";
import { mapsData } from "../canvas/maps";


@Component({
    selector: "app-controller",
    templateUrl: "./controller.component.html",
    styleUrls: ["./controller.component.scss"]
})
export class ControllerComponent implements OnInit {

    constructor(
        private controllerService: ControllerService,
        private webRtcService: WebRtcService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    public map: ISelector = { title: "", name: "", imageName: "", disabled: true, childList: [] };
    public subjectName: string = "math";
    public mapInfo!: canvasInterface.IMapData;

    public task!: canvasInterface.IMapTaskInfo;
    public isAnswerSuccess: boolean = false;
    public checkMessage: string = "";

    public isMoveEnabled: boolean = false;
    public isGrabEnabled: boolean = false;
    public isOpenNotebook: boolean = false;

    public position: IPosition = {
        beta: 0,
        gamma: 0,
        alpha: 0
    };

    ngOnInit(): void {
        this.controllerService.subscribeToDeviceOrientation()
            .subscribe(({ beta, gamma, alpha }) => {
                if (this.isMoveEnabled) {
                    const convertToCircle = this.convertToCircle(gamma, -beta, alpha);

                    [
                        this.position.gamma,
                        this.position.beta,
                        this.position.alpha
                    ] = [
                        convertToCircle.gamma,
                        convertToCircle.beta,
                        convertToCircle.alpha
                    ];

                    this.webRtcService.sendData(
                        webRtcInterface.DataChannelLabelEnum.positionChannel,
                        webRtcInterface.DataChannelPositionTypeEnum.setCameraPosition,
                        { gamma: convertToCircle.gamma, beta: convertToCircle.beta }
                    );
                }
            });

        this.route.paramMap.subscribe(paramMap => {
            const subjectId: number = Number(paramMap.get("subjectId"));
            const mapId: number = Number(paramMap.get("mapId"));
            const currentMap = subjectData.subjectList[subjectId].childList[mapId];
    
            this.map = currentMap;
            this.subjectName = subjectData.subjectList[subjectId].name;
            this.mapInfo = mapsData[this.subjectName][this.map.name];
            
            this.task = this.mapInfo.taskInfo;
        });
    }

    public exit() {
        this.isMoveEnabled = false;
        this.router.navigate(["/room"]);
        this.webRtcService.sendData(webRtcInterface.DataChannelLabelEnum.dataChannel, webRtcInterface.DataChannelDataTypeEnum.exitMap, "");
    }

    public toggleEnableMove(): void {
        this.isMoveEnabled = !this.isMoveEnabled;
    }

    private convertToCircle(gamma: number, beta: number, alpha: number): IPosition {
        if (gamma === 0 || beta === 0) return { gamma, beta, alpha };

        const radius: number = Math.abs(gamma) >= Math.abs(beta) ? gamma : beta;

        const alpha_temp: number = Math.atan(beta / gamma);

        const resultBeta: number = radius * Math.sin(alpha_temp);
        const resultGamma: number = Math.sqrt(radius ** 2 - resultBeta ** 2);

        return {
            gamma: gamma > 0 ? Math.abs(resultGamma) : -Math.abs(resultGamma),
            beta: beta > 0 ? Math.abs(resultBeta) : -Math.abs(resultBeta),
            alpha
        };
    }

    public toggleEnableGrab() {
        this.isGrabEnabled = !this.isGrabEnabled;
    }

    public toggleOpenNotebook() {
        this.isOpenNotebook = !this.isOpenNotebook;
    }

    public checkAnswer(value: string) {
        if (value === this.task.answer) {
            this.isAnswerSuccess = true;
            this.checkMessage = "Верно!";
        } else {
            this.isAnswerSuccess = false;
            this.checkMessage = "Неверно... Возможно ты что-то упустил";
        }

        setTimeout(() => {
            this.isAnswerSuccess = false;
            this.checkMessage = "";
        }, 5000);
    }
}
