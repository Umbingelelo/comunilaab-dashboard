import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() series: any[] = [];
  @Input() type = '';
  @Input() xAxis?: any = {};
  @Input() yAxis?: any = {};
  @Input() dataLabels?: any = { enabled: false };
  @Input() fill?: any;
  @Input() legend?: any = { show: true };
  @Input() responsive?: any;

  public options: any = {};

  ngOnInit(): void {
    if (this.type === 'stacked') {
      this.options = { chart: { type: 'bar', stacked: true, toolbar: { show: false } } };
      this.responsive = [{ breakpoint: 520, options: { xaxis: { tickAmount: 8 }, chart: { height: '500px' }, legend: { show: true, position: 'top', itemMargin: { vertical: 12 } }, } }];
    }
    else {
      this.options = { chart: { type: this.type, toolbar: { show: false } } };
      this.responsive = [{ breakpoint: 520, options: { xaxis: { tickAmount: 8 }, chart: { height: '350px' }, legend: { show: true, position: 'top', itemMargin: { vertical: 12 } }, } }];
    }
  }
}
