import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyButtonComponent } from './my-button.component';

describe('MyButtonComponent', () => {
  let component: MyButtonComponent;
  let fixture: ComponentFixture<MyButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyButtonComponent]
    });
    fixture = TestBed.createComponent(MyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
