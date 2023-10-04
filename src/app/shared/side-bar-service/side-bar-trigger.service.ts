import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SideBarTriggerService {

  public WITHOUT_SIDEBAR = [
    '/auth/login',
    '/auth/logout',
    '/home',
    '/ideas',
    '/projects',

  ]

  constructor(
    private router: Router
  ) { }

  shouldShowNavbar(): boolean {
    const url = this.router.url.split('?')[0];
    return !this.WITHOUT_SIDEBAR.includes(url);
  }
}
