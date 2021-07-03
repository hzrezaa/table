import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }
  // RequestServar(): Observable<any> {
  //   return this.http.get<any>('/user');
  // }
  // GetData() {
  //   return this.Data;
  // }
  // SetData(value: any) {
  //   this.Data.next(value);
  // }
}
