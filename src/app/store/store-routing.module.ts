import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from '../auth/can-activate/can-activate.guard';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: 'store',
    component: IndexComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'store/form/:place_id',
    component: FormComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'store/:id/edit',
    component: FormComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'store/:id',
    component: ViewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
