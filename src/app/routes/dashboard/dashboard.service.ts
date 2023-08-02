import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RegValueService} from "../../../service/reg-value.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";



@Injectable()
export class DashboardService {


  constructor(private http: HttpClient,private regValues: RegValueService) {}
  //getCharts(): Observable<any[]> {
    //return this.http.get<any>("http://localhost:8080/values/findAllValues").pipe(
  getCharts(page = 0, pageSize = 50): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>("http://localhost:8080/values/findAllValues", { params }).pipe(
     map((response: any) => {

        const data = response.result;

        if (!Array.isArray(data)) {
          console.warn("Data is not an array:", data);
          return [];
        }

        // Calcular el límite superior e inferior de los datos
        let upperLimit = Number.MIN_VALUE;
        let lowerLimit = Number.MAX_VALUE;

        data.forEach(item => {
          const value = item.value;
          if (value > upperLimit) {
            upperLimit = value;
          }
          if (value < lowerLimit) {
            lowerLimit = value;
          }
        });

        // Creamos un objeto para almacenar las series de datos para cada valueType
        const seriesByValueType:any[] = [];

        // Recorremos los datos y agrupamos por valueType
        data.forEach(item => {
          const value = item.value;
          const valueType = item.valuesType.description;
          const timestamp = new Date(item.date).getTime();

          if (!seriesByValueType[valueType]) {
            seriesByValueType[valueType] = {
              name: valueType,
              data: [],
            };
          }

          seriesByValueType[valueType].data.push({ x: timestamp, y: value });
        });

        // Convertimos el objeto a un array para obtener las series finales
        const seriesData = Object.values(seriesByValueType);

        // Agregar la serie del límite superior
        seriesData.push({
          name: 'Upper Limit',
          data: data.map(item => ({
            x: new Date(item.date).getTime(),
            y: upperLimit,
          })),
        });

        // Agregar la serie del límite inferior
        seriesData.push({
          name: 'Lower Limit',
          data: data.map(item => ({
            x: new Date(item.date).getTime(),
            y: lowerLimit,
          })),
        });

        // Agregar la serie de la línea de intersección
        const intersectionPoint = {
          x: new Date('2022-07-22T05:05:00').getTime(),
          y: 0,
        };
        seriesData.push({
          name: 'Intersection',
          data: [intersectionPoint],
        });

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
          series: seriesData,
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
          // Agregar el límite superior e inferior al objeto chartData
          upperLimit: upperLimit,
          lowerLimit: lowerLimit,
        };

        console.log('Chart data:', chartData);
        return [chartData];
      })
    );
  }
}
