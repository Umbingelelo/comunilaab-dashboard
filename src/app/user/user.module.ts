import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../shared/shared.module';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccessModalComponent } from './access-modal/access-modal.component';


@NgModule({
  declarations: [
    IndexComponent,
    UserDeleteComponent,
    UserModalComponent,
    UserFormComponent,
    UserDeleteComponent,
    ChangePasswordModalComponent,
    AccessModalComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class UserModule { }
