import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataChannelDataTypeEnum, DataChannelLabelEnum } from '../../../store/webrtc-store/webrtc.interface';
import { WebRtcReducerState } from '../../../store/webrtc-store/webrtc.reducer';
import * as webRtcActions from '../../../store/webrtc-store/webrtc.actions';

export interface ISelectorItem {
  title: string,
  imageName: string,
  disabled: boolean,
}

export interface ISelector {
  title: string,
  imageName: string,
  disabled: boolean,
  children: ISelectorItem[]
}

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private webRtcStore: Store<WebRtcReducerState>
  ) { }

  @Input() connectStatus: boolean = false

  public title: string = '';
  public backButtonShow: boolean = false
  public srcOrigin: string = '/room/selector/'
  public srcMedia: string = '/app/media/selector/'
  public selectorList: ISelectorItem[] = []
  public isOpenMap: boolean = false


  private selectorData: ISelector[] = [
    {
      title: 'Алгебра',
      imageName: 'algebra.jpg',
      children: [
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
      children: []
    },
    {
      title: 'Физика',
      imageName: 'physics.jpg',
      disabled: true,
      children: []
    },
    {
      title: 'Химия',
      imageName: 'chemistry.jpg',
      disabled: true,
      children: []
    },
    {
      title: 'Астрономия',
      imageName: 'astronomy.jpg',
      disabled: true,
      children: []
    },
  ]

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (!params['subjectId'] && !params['mapId']) {
        this.title = 'Выберете учебный предмет'
        this.selectorList = this.selectorData
        this.backButtonShow = false
      } else if (params['subjectId'] && !params['mapId']) {
        this.title = 'Выберете карту'
        this.selectorList = this.selectorData[params['subjectId']].children
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
