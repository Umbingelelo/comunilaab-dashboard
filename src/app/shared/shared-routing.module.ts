import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevDocComponent } from './devdoc/dev-doc.component';
import { AuthGuard } from '../auth/can-activate/can-activate.guard';
import { RedirectComponent } from './redirect/redirect.component';

const routes: Routes = [
  {
    path: 'dev/devdoc',
    component: DevDocComponent,
    data: { title: 'Dashboard' },
    canActivate: [AuthGuard]
  },
  {
    path: 'redirect',
    component: RedirectComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
