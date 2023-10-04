import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceRoutingModule } from './place-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';
import { ConfigComponent } from './config/config.component';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';


@NgModule({
  declarations: [
    IndexComponent,
    FormComponent,
    ViewComponent,
    ConfigComponent,
    MapEditorComponent
  ],
  imports: [
    CommonModule,
    PlaceRoutingModule,
    SharedModule,
    FontAwesomeModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    PinchZoomModule
  ]
})
export class PlaceModule { }
