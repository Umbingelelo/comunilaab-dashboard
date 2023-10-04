import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from '../auth/can-activate/can-activate.guard';
import { ViewComponent } from './view/view.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {
    path: 'information',
    component: IndexComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'information/:id',
    component: ViewComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'information/form/:place_id',
    component: FormComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'information/:id/edit',
    component: FormComponent,
    canActivate: [AuthGuard],
    data: { formType: 'edit' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationRoutingModule { }
