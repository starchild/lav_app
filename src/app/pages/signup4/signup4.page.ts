import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from "@angular/common";
import { Router} from '@angular/router';
import {StorageService} from '../../services/storage/storage.service';
import { config } from 'src/app/config/config';
import { DbService } from '../../services/sqlite/db.service';

@Component({
  selector: 'app-signup4',
  templateUrl: './signup4.page.html',
  styleUrls: ['./signup4.page.scss'],
})
export class Signup4Page implements OnInit {
  validationsform: FormGroup;
  paymentMethod = [
    {name: "Credit Card", value: "Credit Card"},
    {name: "Cheque", value: "Cheque"},
    {name: "Bank Deposit", value: "Bank Deposit"},
    {name: "Bank Deposit", value: "Bank Deposit"},
  ];

  businessStructure = [
    {name: "Sole Trader", value: "Sole Trader"},
    {name: "Partnership", value: "Partnership"},
    {name: "Company", value: "Company"},
    {name: "Family Trust", value: "Family Trust"},
  ];
  profileInfo: any;
  loginedUser : any;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public location: Location,
    public storageService: StorageService,
    public db: DbService,
  ) { }

  ngOnInit() {
    this.validationsform = this.formBuilder.group({

      payment_method: new FormControl('', Validators.compose([
        Validators.required
      ])),   
      business_structure: new FormControl('', Validators.compose([
        Validators.required
      ])),   
      abn: new FormControl('', Validators.compose([
        Validators.required
      ])),     
      trading_years: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      domain_name: new FormControl('', Validators.compose([
        Validators.required
      ])),  
    });
  }

  async submit(value){
    this.loginedUser = await this.storageService.getObject('loginedUser');

    this.profileInfo = await this.storageService.getObject(config.profileInfo);
    this.profileInfo.payment_method = value.payment_method;
    this.profileInfo.business_structure = value.business_structure;
    this.profileInfo.abn = value.abn;
    this.profileInfo.trading_years = value.trading_years;
    this.profileInfo.domain_name = value.domain_name;
    var insertdata = this.profileInfo;
    console.log(this.profileInfo);
    var str_query =
      "INSERT INTO Customer ( abn, address1, address2, business_structure, city, email, password, country, domain_name, first_name, last_name, payment_method, phone, position, zip, shop_phone, state, trading_years, distributor_businessName, is_sales_rep, parent_id, status) VALUES ";

    var rowArgs = [];
    var data = [];
    rowArgs.push("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    data = [insertdata.abn, insertdata.address1, insertdata.address2, insertdata.business_structure, insertdata.city, insertdata.confirm_email, insertdata.confirm_password, insertdata.countrykey, insertdata.domain_name, insertdata.first_name, insertdata.last_name, insertdata.payment_method, insertdata.phone, insertdata.position, insertdata.post_code, insertdata.shop_phone, insertdata.state, insertdata.trading_years, insertdata.business_name, 1, this.loginedUser.id, 2];

    str_query += rowArgs.join(", ");
    var insertId = await this.db.addToSqlite(str_query, data);    
    console.log("insertId===", insertId);
    // this.storageService.setObject('loginedUser', this.profileInfo);
    // this.router.navigate(['/home']);
  }
  back() {
    this.location.back();
  }
}
