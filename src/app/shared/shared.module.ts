import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CircularChartComponent } from './charts/circular-chart/circular-chart.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { BodyComponent } from './body/body.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedRoutingModule } from './shared-routing.module';
import { DevDocComponent } from './devdoc/dev-doc.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { PaginationTableComponent } from './pagination-table/pagination-table.component';
import { MasterTableComponent } from './master-table/master-table.component';
import { ComponentCarouselComponent } from './component-carousel/component-carousel.component';
import { RedirectComponent } from './redirect/redirect.component';


@NgModule({
  declarations: [
    CircularChartComponent,
    BarChartComponent,
    BodyComponent,
    SideBarComponent,
    DevDocComponent,
    SearchTableComponent,
    PaginationTableComponent,
    MasterTableComponent,
    ComponentCarouselComponent,
    RedirectComponent
  ],
  exports: [
    BodyComponent,
    SideBarComponent,
    SearchTableComponent,
    PaginationTableComponent,
    MasterTableComponent,
    CircularChartComponent,
    BarChartComponent,
    ComponentCarouselComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    FontAwesomeModule,
    SharedRoutingModule,
  ],
})
export class SharedModule { }
