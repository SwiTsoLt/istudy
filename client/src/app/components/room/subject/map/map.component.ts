import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

interface IMap {
  title: string,
  imageUrl: string,
  src: string,
  disabled: boolean,
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['../subject.component.scss']
})
export class MapComponent {
  @Input() connectStatus: boolean = false

  private srcOrigin: string = ''

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params: Params) => {
      this.srcOrigin = `/room/subject/${params['subjectId'] ?? 0}/`
    })
  }

  public mapList: IMap[] = [
    {
      title: 'Катер',
      imageUrl: 'https://www.tessllc.us/wp-content/uploads/2020/07/yacht-post-825x510.jpg',
      src: `${this.srcOrigin}0`,
      disabled: false,
    },
    {
      title: 'Поезд',
      imageUrl: 'https://citytraffic.ru/wp-content/uploads/2019/08/%D0%BF%D0%BE%D0%B5%D0%B7%D0%B4-%D0%BA%D1%83%D0%BF%D0%B5-1024x682.jpg',
      src: `${this.srcOrigin}1`,
      disabled: true,
    },
  ]
}
