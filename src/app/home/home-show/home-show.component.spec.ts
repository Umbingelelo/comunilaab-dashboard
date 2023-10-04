import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeShowComponent } from './home-show.component';

describe('HomeShowComponent', () => {
  let component: HomeShowComponent;
  let fixture: ComponentFixture<HomeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
