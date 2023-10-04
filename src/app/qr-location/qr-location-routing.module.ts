import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { AuthGuard } from '../auth/can-activate/can-activate.guard';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {
    path: 'qrlocation',
    component: IndexComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'qrlocation/form',
    component: FormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'qrlocation/:id',
    component: ViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'qrlocation/:id/edit',
    component: FormComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrLocationRoutingModule { }
