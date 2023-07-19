import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  charts: any[] = [];
  chart1: any;
  notifySubscription!: Subscription;

  constructor(
    private ngZone: NgZone,
    private dashboardSrv: DashboardService
  ) {}

  ngOnInit() {
    this.dashboardSrv.getCharts().subscribe((data: any[]) => {
      this.charts = data;
      this.initChart(); // Call initChart() here
    });
  }



  initChart() {
    if (this.charts.length > 0) {
      this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
      this.chart1.render();
    }
  }


}
