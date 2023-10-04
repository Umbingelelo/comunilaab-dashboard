import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdeasShowComponent } from './ideas-show/ideas-show.component';



const routes: Routes = [
  {
    path: 'ideas',
    component: IdeasShowComponent,
    data: { title: 'Home' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeasRoutingModule { }
