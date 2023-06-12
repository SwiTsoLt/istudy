import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseMapComponent } from './choose-map.component';

describe('ChooseMapComponent', () => {
  let component: ChooseMapComponent;
  let fixture: ComponentFixture<ChooseMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseMapComponent]
    });
    fixture = TestBed.createComponent(ChooseMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
