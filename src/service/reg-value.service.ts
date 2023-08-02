import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterValue} from "../domain/registerValue";
import {Observable} from "rxjs";
import {RegisterDate} from "../domain/registerDate";

@Injectable({
  providedIn: 'root'
})
export class RegValueService {

  constructor(private httpClient: HttpClient) { }
  //metodo post ara guardar los valores de registro
  saveValue(registerValue: RegisterValue):Observable<any[]>{
    return this.httpClient.post<any>("http://localhost:8080/values/saveValue",registerValue);

  }

  uploadData(formData: FormData): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/values/Import', formData);
  }
//metodo get para buscar por ID
  findValueById(ID: number | bigint):Observable<any[]>{
    return this.httpClient.get<RegisterValue[]>("http://localhost:8080/values/findDateById/"+ID);
  }
  //metodo get para buscar todo
  findAllValues():Observable<any[]>{
    return this.httpClient.get<RegisterDate[]>("http://localhost:8080/values/findAllValues");
  }
}
