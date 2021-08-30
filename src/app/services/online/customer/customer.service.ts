import { Injectable } from '@angular/core';
import { config } from '../../../config/config';
import { HttpClient } from '@angular/common/http';
const api_baseUrl = config.api_baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  constructor(
    private http: HttpClient
  ) { }

  getAgentList(reg_date : any){
    return this.http.get<any>(api_baseUrl + `/getagents?reg_date=${reg_date}`);
  }
  getCustomerByAgent(maxId : any, userId : any){
    return this.http.get<any>(api_baseUrl + `/getcustomers?maxId=${maxId}&userId=${userId}`);
  }
}
