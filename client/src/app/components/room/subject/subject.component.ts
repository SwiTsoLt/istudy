import { Component, Input } from '@angular/core';

interface ISubject {
  title: string,
  imageUrl: string,
  src: string,
  disabled: boolean,
}

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {
  @Input() connectStatus: boolean = false

  private srcOrigin: string = '/room/subject/'
  
  public subjectList: ISubject[] = [
    {
      title: 'Алгебра',
      imageUrl: 'https://www.science.edu/acellus/wp-content/uploads/2016/12/mathematics-1509559.jpg',
      src: `${this.srcOrigin}0`,
      disabled: false,
    },
    {
      title: 'Геометрия',
      imageUrl: 'https://news.harvard.edu/wp-content/uploads/2022/11/iStock-mathproblems-1200x800.jpg',
      src: `${this.srcOrigin}1`,
      disabled: true,
    },
    {
      title: 'Физика',
      imageUrl: 'https://eurohighereducation.com/wp-content/uploads/2023/03/chalkboard-with-science-physics-formulas-template-for-your-design-vector.jpg',
      src: `${this.srcOrigin}2`,
      disabled: true,
    },
    {
      title: 'Химия',
      imageUrl: 'https://www.meritstore.in/wp-content/uploads/2016/12/10-reasons-to-love-Chemistry.png?x79684',
      src: `${this.srcOrigin}3`,
      disabled: true,
    },
    {
      title: 'Астрономия',
      imageUrl: 'https://www.shutterstock.com/shutterstock/photos/306281510/display_1500/stock-vector-seamless-pattern-of-the-formulas-on-the-astronomy-on-blackboard-306281510.jpg',
      src: `${this.srcOrigin}4`,
      disabled: true,
    },
  ]
}
