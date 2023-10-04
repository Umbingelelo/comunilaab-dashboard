import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasItemComponent } from './ideas-item.component';

describe('IdeasItemComponent', () => {
  let component: IdeasItemComponent;
  let fixture: ComponentFixture<IdeasItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeasItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeasItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
