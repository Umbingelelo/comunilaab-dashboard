import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeShowComponent } from './home-show/home-show.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeShowComponent,
    data: { title: 'Home' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
