import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent {
  public url: string = window.location.pathname

  constructor(
    private router: Router
  ) {}

  public goHome(): void {
    this.router.navigate(['/home'])
  }
}
