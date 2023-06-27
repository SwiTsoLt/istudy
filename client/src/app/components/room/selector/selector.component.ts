import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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
    private route: ActivatedRoute
  ) { }

  @Input() connectStatus: boolean = false

  public title: string = '';
  public backButtonShow: boolean = false
  public srcOrigin: string = '/room/selector/'
  public srcMedia: string = '/app/media/selector/'
  public selectorList: ISelectorItem[] = []


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
      }
    })
  }

  public back() {
    window.history.go(-1)
  }
}
