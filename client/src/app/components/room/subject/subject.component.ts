import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataChannelDataTypeEnum, DataChannelLabelEnum } from '../../../store/webrtc-store/webrtc.interface';
import { WebRtcReducerState } from '../../../store/webrtc-store/webrtc.reducer';
import * as webRtcActions from '../../../store/webrtc-store/webrtc.actions';

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
    private webRtcStore: Store<WebRtcReducerState>
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

  public openMap(url: string) {
    this.webRtcStore.dispatch(webRtcActions.sendMessage({ label: DataChannelLabelEnum.dataChannel, messageType: DataChannelDataTypeEnum.openMap, data: window.location.pathname + '/' + url }))
    this.router.navigate(["/controller"])
  }
}
