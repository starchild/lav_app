import { Injectable } from '@angular/core';
import { config } from '../../../config/config';

import { HttpClient } from '@angular/common/http';
const api_baseUrl = config.api_baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
  ) { }

  getProdCatFromServer(prodcat_maxId, productCategory_maxId){
    return this.http.get<any>(api_baseUrl + `/getcategories?prodcat_maxId=${prodcat_maxId}&productCategory_maxId=${productCategory_maxId}`);
  }
}
