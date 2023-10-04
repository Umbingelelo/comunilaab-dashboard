import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { SideBarTriggerService } from './shared/side-bar-service/side-bar-trigger.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'accionet-morty';

  public showNavbar = false;
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    public activateRouter: ActivatedRoute,
    public SideBarTriggerService: SideBarTriggerService
  ) { }

  ngOnInit(): void {
    initFlowbite();
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.onRouteChange(event.urlAfterRedirects);
      });
  }

  onRouteChange(url: string) {
    this.showNavbar = this.SideBarTriggerService.shouldShowNavbar();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
