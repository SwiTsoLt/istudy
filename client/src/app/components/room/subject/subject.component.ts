import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WebRtcService } from '../../../webrtc.service';
import * as webRtcInterface from '../../../store/webrtc-store/webrtc.interface';

export interface IMap {
  title: string,
  imageName: string,
  disabled: boolean,
}

export interface ISubject {
  title: string,
  imageName: string,
  disabled: boolean,
  mapList: IMap[]
}

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private webRtcService: WebRtcService
    ) { }

  @Input() connectStatus: boolean = false

  public title: string = '';
  public backButtonShow: boolean = false
  public srcOrigin: string = '/room/subject/'
  public srcMedia: string = '/app/media/subject/'
  public isOpenMap: boolean = false
  public mapList: IMap[] = [] 

  private subjectList: ISubject[] = [
    {
      title: 'Алгебра',
      imageName: 'algebra.jpg',
      mapList: [
        {
          title: 'Лодка',
          imageName: 'boat.jpg',
          disabled: false,
        },
        {
          title: 'Поезд',
          imageName: 'train.jpg',
          disabled: true,
        }
      ],
      disabled: false,
    },
    {
      title: 'Геометрия',
      imageName: 'geometry.jpg',
      disabled: true,
      mapList: []
    },
    {
      title: 'Физика',
      imageName: 'physics.jpg',
      disabled: true,
      mapList: []
    },
    {
      title: 'Химия',
      imageName: 'chemistry.jpg',
      disabled: true,
      mapList: []
    },
    {
      title: 'Астрономия',
      imageName: 'astronomy.jpg',
      disabled: true,
      mapList: []
    },
  ]

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (!params['subjectId'] && !params['mapId']) {
        this.title = 'Выберете учебный предмет'
        this.mapList = this.subjectList
        this.backButtonShow = false
      } else if (params['subjectId'] && !params['mapId']) {
        this.title = 'Выберете карту'
        this.mapList = this.subjectList[params['subjectId']].mapList
        this.backButtonShow = true
        this.isOpenMap = true
      }
    })
  }

  public back() {
    window.history.go(-1)
  }

  public openMap(mapId: string) {
    const url = window.location.pathname + '/' + mapId
    this.webRtcService.sendData(webRtcInterface.DataChannelLabelEnum.dataChannel, webRtcInterface.DataChannelDataTypeEnum.openMap, url)
    this.router.navigate(["/controller"])
  }
}
