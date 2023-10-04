import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasShowComponent } from './ideas-show.component';

describe('IdeasShowComponent', () => {
  let component: IdeasShowComponent;
  let fixture: ComponentFixture<IdeasShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeasShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeasShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
