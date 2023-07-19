import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RegValueService} from "../../../service/reg-value.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";



@Injectable()
export class DashboardService {


  constructor(private http: HttpClient,private regValues: RegValueService) {}





  //getCharts() {
   // return this.charts;

  //}
  getCharts(): Observable<any[]> {
    return this.http.get<any>("http://localhost:8080/values/findAllValues").pipe(
      map((response: any) => {
        const data = response.result; // Obtener el array de datos desde la propiedad "result"

        if (!Array.isArray(data)) {
          console.warn("Data is not an array:", data);
          return []; // Devuelve un array vacío en lugar de lanzar un error
        }

        const chartData = {
          chart: {
            height: 500,
            width: 1950,
            type: 'area',
            toolbar: false,
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
          },
          series: [
            {
              name: 'Value',
              data: data.map(item => ({
                x: new Date(item.date).getTime(),
                y: item.value,
              })),
            },
          ],
          xaxis: {
            type: 'datetime',
            categories: data.map(item => item.date),
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm',
            },
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
          },
        };

        console.log('Chart data:', chartData);

        return [chartData];
      })
    );
  }




}
