import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from '../auth/can-activate/can-activate.guard';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { ConfigComponent } from './config/config.component';
import { MapEditorComponent } from './map-editor/map-editor.component';

const routes: Routes = [{
  path: 'place',
  component: IndexComponent,
  canActivate: [AuthGuard]
}, {
  path: 'place/form',
  component: FormComponent,
  canActivate: [AuthGuard]
}, {
  path: 'place/:id',
  component: ViewComponent,
  canActivate: [AuthGuard]
}, {
  path: 'place/:id/edit',
  component: FormComponent,
  canActivate: [AuthGuard],
  data: { type: 'edit' }
}, {
  path: 'place/:id/config',
  component: ConfigComponent,
  canActivate: [AuthGuard],
}, {
  path: 'place/:id/map/editor',
  component: MapEditorComponent,
  canActivate: [AuthGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceRoutingModule { }
