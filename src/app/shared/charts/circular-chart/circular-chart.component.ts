import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circular-chart',
  templateUrl: './circular-chart.component.html',
  styleUrls: ['./circular-chart.component.css']
})
export class CircularChartComponent implements OnInit {
  @Input() series: number[] = [];
  @Input() type = '';
  @Input() labels?: any;
  @Input() dataLabels?: any = { enabled: false };
  @Input() fill?: any;
  @Input() legend?: any = { show: true };
  @Input() responsive?: any;

  public options: any = {};

  ngOnInit(): void {
    this.options = { chart: { type: this.type, toolbar: { show: false } } };
    this.responsive = [{ breakpoint: 520, options: { chart: { height: '400px' }, legend: { show: true, position: 'bottom', itemMargin: { vertical: 12 } } } }];
  }

}
