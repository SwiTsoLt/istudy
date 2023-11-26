import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WebRtcService } from "../../../../webrtc.service";
import * as webRtcInterface from "../../../../store/webrtc-store/webrtc.interface";
import { subjectData } from "../../subjectData";

export interface ISelector {
    title: string,
    name: string,
    imageName: string,
    disabled: boolean,
    childList: ISelector[]
}

@Component({
    selector: "app-subject",
    templateUrl: "./subject.component.html",
    styleUrls: ["./subject.component.scss"]
})
export class SubjectComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private webRtcService: WebRtcService
    ) { }

    @Input() connectStatus: boolean = false;

    public title: string = "";
    public backButtonShow: boolean = false;
    public readonly srcOrigin: string = "/room/subject/";
    public readonly srcMedia: string = "/app/media/subject/";
    public isOpenMap: boolean = false;
    public mapList: ISelector[] = [];

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            if (!params["subjectId"] && !params["mapId"]) {
                this.title = "Выберете учебный предмет";
                this.mapList = subjectData.subjectList;
                this.backButtonShow = false;
            } else if (params["subjectId"] && !params["mapId"]) {
                this.title = "Выберете карту";
                this.mapList = subjectData.subjectList[params["subjectId"]].childList;
                this.backButtonShow = true;
                this.isOpenMap = true;
            }
        });
    }

    public back() {
        window.history.go(-1);
    }

    public openMap(mapId: string) {
        const url = window.location.pathname + "/" + mapId;
        const urlSplit = window.location.pathname.split("/");
        const subjectId = urlSplit[urlSplit.length - 1];
        this.webRtcService.sendData(webRtcInterface.DataChannelLabelEnum.dataChannel, webRtcInterface.DataChannelDataTypeEnum.openMap, url);
        this.router.navigate([`/controller/${subjectId}/${mapId}`]);
    }
}
