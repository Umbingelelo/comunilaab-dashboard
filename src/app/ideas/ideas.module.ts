import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeasShowComponent } from './ideas-show/ideas-show.component';
import { IdeasRoutingModule } from './ideas-routing.module';
import { IdeasItemComponent } from './ideas-item/ideas-item.component';



@NgModule({
  declarations: [
    IdeasShowComponent,
    IdeasItemComponent
  ],
  imports: [
    CommonModule,
    IdeasRoutingModule
  ]
})
export class IdeasModule { }
