import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RegisterDate} from "../domain/registerDate";
import {ValuesType} from "../domain/valuesType";

@Injectable({
  providedIn: 'root'
})
export class ValuesService {

  constructor(private httpClient: HttpClient) { }
  //metodo get para buscar los valores por ID
  findValueById(ID: number | bigint):Observable<any[]>{
    return this.httpClient.get<ValuesType[]>("http://localhost:8080/valuesTypeController/findDateById/"+ID);
  }
  //metodo get para buscar todo
  findAllValues():Observable<any[]>{
    return this.httpClient.get<ValuesType[]>("http://localhost:8080/valuesTypeController/findAllValues");
  }

}
