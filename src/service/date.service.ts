import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterDate} from "../domain/registerDate";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private httpClient: HttpClient) { }
  //metodo post para guardar las fechas
  saveDate(registerDate: RegisterDate):Observable<any[]>{
    return this.httpClient.post<any>("http://localhost:8080/dates/saveDate",registerDate);

  }
  //metodo get para buscar fecha por ID
  findDateById(ID: number | bigint):Observable<any[]>{
    return this.httpClient.get<RegisterDate[]>("http://localhost:8080/dates/findDateById/"+ID);
  }
  //metodo get para buscar todas las fechas
  findAll():Observable<any[]>{
    return this.httpClient.get<RegisterDate[]>("http://localhost:8080/dates/findAll");


  }
}
