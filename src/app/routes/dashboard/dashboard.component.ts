import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from './dashboard.service';
interface DataPoint {
  x: number | bigint;
  y: number | bigint;
}
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
  //notifySubscription!: Subscription;
  currentPage = 0;
  pageSize = 50000;
  totalDataPages = 0;




  intersectionPointValue = 0; // Variable para almacenar el valor del punto de intersección

  correlationTagWithUpperLimit = 0;
  correlationTagWithLowerLimit = 0;

  constructor(
    private ngZone: NgZone,
    private dashboardSrv: DashboardService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    //this.dashboardSrv.getCharts().subscribe((data: any[]) => {
     // this.charts = data;
      //this.initChart();
      //this.calculateCorrelations(); // Llamar al cálculo de correlaciones después de inicializar el gráfico
    //});
    //this.loadChartsPage();
    this.loadChartsPage();
  }
  initChart() {
    if (this.charts.length > 0) {
      this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
      this.chart1.render();
    }
  }
  calculateCorrelations() {
    // Extract the data from the chart
    const seriesData = this.charts[0].series[0].data;
    console.log(seriesData);
    const upperLimitData = this.charts[0].series[1].data;
    const lowerLimitData = this.charts[0].series[2].data;

    // Calculate correlations using Pearson's correlation coefficient formula
    const n = seriesData.length;
    console.log("series: " + n);

    let sumTag = 0;
    let sumUpperLimit = 0;
    let sumLowerLimit = 0;
    let sumTagUpperLimit = 0;
    let sumTagLowerLimit = 0;
    let sumUpperLimitUpperLimit = 0;
    let sumLowerLimitLowerLimit = 0;

    for (let i = 0; i < n; i++) {
      sumTag += seriesData[i].y;
      sumUpperLimit += upperLimitData[i].y;
      sumLowerLimit += lowerLimitData[i].y;
      sumTagUpperLimit += seriesData[i].y * upperLimitData[i].y;
      sumTagLowerLimit += seriesData[i].y * lowerLimitData[i].y;
      sumUpperLimitUpperLimit += upperLimitData[i].y * upperLimitData[i].y;
      sumLowerLimitLowerLimit += lowerLimitData[i].y * lowerLimitData[i].y;
    }

    const epsilon = 1e-9; // Small value to avoid division by very small numbers
    const numeratorUpper = n * sumTagUpperLimit - sumTag * sumUpperLimit;
    console.log("numeratorUpper " + numeratorUpper);
    const numeratorLower = n * sumTagLowerLimit - sumTag * sumLowerLimit;
    console.log("numeratorLower " + numeratorLower);
    let denominatorUpper = Math.sqrt(
      (n * sumTagUpperLimit - sumTag * sumUpperLimit) * (n * sumUpperLimitUpperLimit - sumUpperLimit * sumUpperLimit)
    );
    console.log("denominatorUpper " + denominatorUpper);
    let denominatorLower = Math.sqrt(
      (n * sumTagLowerLimit - sumTag * sumLowerLimit) * (n * sumLowerLimitLowerLimit - sumLowerLimit * sumLowerLimit)
    );
    console.log("denominatorLower " + denominatorLower);

    // Avoid division by very small values
    if (Math.abs(denominatorUpper) < epsilon) {
      denominatorUpper = epsilon;
    }
    if (Math.abs(denominatorLower) < epsilon) {
      denominatorLower = epsilon;
    }

   /* this.correlationTagWithUpperLimit = numeratorUpper / denominatorUpper;
    console.log("1");
    console.log(this.correlationTagWithUpperLimit);
    this.correlationTagWithLowerLimit = numeratorLower / denominatorLower;
    console.log("2");
    console.log(this.correlationTagWithLowerLimit);

    const intersectionPoint = { x: new Date('2022-07-22T5:05:00').getTime() };
    const intersectionData = seriesData.find((item: DataPoint) => item.x === intersectionPoint.x);

    if (intersectionData) {
      // Set the correlation values based on intersection data
      this.correlationTagWithUpperLimit = intersectionData.y;
      this.correlationTagWithLowerLimit = intersectionData.y;
      // Set the intersection point value
      this.intersectionPointValue = intersectionData.y;
    } else {
      // Si no se encuentra el punto de intersección en los datos, establecer los valores en cero o el valor deseado.
      this.correlationTagWithUpperLimit = 1;
      this.correlationTagWithLowerLimit = 1;
      // Set the intersection point value to 0 or desired value
      this.intersectionPointValue = 1;
    }*/
    this.correlationTagWithUpperLimit = numeratorUpper / denominatorUpper;
    console.log("1");
    console.log(this.correlationTagWithUpperLimit);
    this.correlationTagWithLowerLimit = numeratorLower / denominatorLower;
    console.log("2");
    console.log(this.correlationTagWithLowerLimit);

    const intersectionPoint = { x: new Date('2022-07-22T5:05:00').getTime() };
    const intersectionData = seriesData.find((item: DataPoint) => item.x === intersectionPoint.x);

    if (intersectionData) {
      this.intersectionPointValue = intersectionData.y;
      console.log("3")
      console.log(this.intersectionPointValue);
    } else {
      this.intersectionPointValue = 0;
    }

    // Forzar la detección de cambios
    this.ngZone.run(() => {
      this.changeDetectorRef.detectChanges();
    });

  }
  loadChartsPage() {
    this.dashboardSrv.getCharts(this.currentPage, this.pageSize).subscribe((data: any[]) => {
      this.charts = data;
      this.initChart();
      this.calculateCorrelations();
      this.totalDataPages = this.charts[0].totalPages; // Obtener el número total de páginas de datos desde el backend
    });
  }

  loadNextPage() {
    if (this.currentPage < this.totalDataPages - 1) {
      this.currentPage++;
      this.loadChartsPage();
    }
  }

  loadPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadChartsPage();
    }
  }

}
