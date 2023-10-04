import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeShowComponent } from './home-show/home-show.component';
import { HomeRoutingModule } from './home-routing.module';



@NgModule({
  declarations: [
    HomeShowComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
