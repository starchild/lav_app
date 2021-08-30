import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from "@angular/common";
import { Router} from '@angular/router';
import {StorageService} from '../../services/storage/storage.service';
import { config } from 'src/app/config/config';

@Component({
  selector: 'app-signup-third',
  templateUrl: './signup-third.page.html',
  styleUrls: ['./signup-third.page.scss'],
})
export class SignupThirdPage implements OnInit {
  validationsform: FormGroup;
  profileInfo: any;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public location: Location,
    public storageService: StorageService,
  ) { }

  ngOnInit() {
    this.validationsform = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      confirm_email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),      
      confirm_password: new FormControl('', Validators.compose([
        Validators.required
      ])),                                      
      password: new FormControl('', Validators.compose([
        Validators.minLength(6)
      ])),

      position: new FormControl('', Validators.compose([
        Validators.required,
      ])),   

      shop_phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),   

      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),   
      business_name: new FormControl('', Validators.compose([
        Validators.required,
        
      ])),   
                           
    });
  }

  async submit(value){
    this.profileInfo = await this.storageService.getObject(config.profileInfo);
    this.profileInfo.confirm_email = value.confirm_email;
    this.profileInfo.confirm_password = value.confirm_password;
    this.profileInfo.position = value.position;
    this.profileInfo.shop_phone = value.shop_phone;
    this.profileInfo.phone = value.phone;
    this.profileInfo.business_name = value.business_name;

    this.storageService.setObject(config.profileInfo, this.profileInfo);
    this.router.navigate(['/login']);
  }

  back() {
    this.location.back();
  }
}
