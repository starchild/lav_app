import { Injectable } from '@angular/core';
import { config } from '../../../config/config';

import { HttpClient } from '@angular/common/http';
const api_baseUrl = config.api_baseUrl;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getSaveOrderData(saveorder_regdate, order_regdate, user_id){
    return this.http.get<any>(api_baseUrl + `/getorderdata?saveorder_regdate=${saveorder_regdate}&order_regdate=${order_regdate}&user_id=${user_id}`);
  }
}
