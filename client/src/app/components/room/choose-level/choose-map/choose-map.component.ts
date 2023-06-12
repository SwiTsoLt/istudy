import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface IMap {
  title: string
}

@Component({
  selector: 'app-choose-map',
  templateUrl: './choose-map.component.html',
  styleUrls: ['./choose-map.component.scss']
})
export class ChooseMapComponent implements OnInit {

  public mapList: IMap[] = [
    {title: 'Boat'},
    {title: ''},
    {title: ''},
    {title: ''},
  ]

  public mapName: string = ''

  constructor(
    private route: ActivatedRoute
  ){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const subjectId: number = Number(params.get('id'))
      this.mapName = this.mapList[subjectId].title
    })
  }

}
