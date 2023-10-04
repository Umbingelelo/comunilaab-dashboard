import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardShowComponent } from './dashboard-show/dashboard-show.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardShowComponent,
    data: { title: 'Dashboard' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
