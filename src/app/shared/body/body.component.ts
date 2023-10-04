import { Component } from '@angular/core';
import { SideBarTriggerService } from '../side-bar-service/side-bar-trigger.service';
import { fadeInOut } from 'src/app/transitions.animation';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
  animations: [fadeInOut]
})
export class BodyComponent {

  public showNavbar = false;

  constructor(
    public SideBarTriggerService: SideBarTriggerService
  ) { }

  shouldShowNavbar() {
    return this.SideBarTriggerService.shouldShowNavbar();
  }

}
