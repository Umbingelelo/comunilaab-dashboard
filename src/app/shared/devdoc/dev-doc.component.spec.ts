import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevDocComponent } from './dev-doc.component';

describe('DevDocComponent', () => {
  let component: DevDocComponent;
  let fixture: ComponentFixture<DevDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevDocComponent]
    });
    fixture = TestBed.createComponent(DevDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
