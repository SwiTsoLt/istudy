import { Component, Input } from '@angular/core';

interface ISubject {
  title: string,
  imageUrl: string,
  src: string
}

@Component({
  selector: 'app-choose-level',
  templateUrl: './choose-level.component.html',
  styleUrls: ['./choose-level.component.scss']
})
export class ChooseLevelComponent {
  @Input() connectStatus: boolean = false

  public subjectList: ISubject[] = [
    {
      title: 'Алгебра',
      imageUrl: 'https://www.science.edu/acellus/wp-content/uploads/2016/12/mathematics-1509559.jpg',
      src: '/room/choose-level/choose-map/0'
    },
    {
      title: 'Геометрия',
      imageUrl: 'https://news.harvard.edu/wp-content/uploads/2022/11/iStock-mathproblems-1200x800.jpg',
      src: '/room/choose-level/choose-map/1'
    },
    {
      title: 'Физика',
      imageUrl: 'https://eurohighereducation.com/wp-content/uploads/2023/03/chalkboard-with-science-physics-formulas-template-for-your-design-vector.jpg',
      src: '/room/choose-level/choose-map/2'
    },
    {
      title: 'Химия',
      imageUrl: 'https://www.meritstore.in/wp-content/uploads/2016/12/10-reasons-to-love-Chemistry.png?x79684',
      src: '/room/choose-level/choose-map/3'
    },
    {
      title: 'Астрономия',
      imageUrl: 'https://www.shutterstock.com/shutterstock/photos/306281510/display_1500/stock-vector-seamless-pattern-of-the-formulas-on-the-astronomy-on-blackboard-306281510.jpg',
      src: '/room/choose-level/choose-map/4'
    },
  ]
}
