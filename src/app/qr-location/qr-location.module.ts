import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrLocationRoutingModule } from './qr-location-routing.module';
import { ViewComponent } from './view/view.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../shared/shared.module';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ViewComponent,
    IndexComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    QrLocationRoutingModule,
    QRCodeModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class QrLocationModule { }
