import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController, ToastController, MenuController } from '@ionic/angular';
import {StorageService} from '../../services/storage/storage.service';
import { DbService } from '../../services/sqlite/db.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CartSettingService } from "../../services/global-carttsetting/cart-setting.service";
import { config } from 'src/app/config/config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  loginedUser : any;
  profileInfo : any;
  validationsform: FormGroup;
  countryList = [];
  stateList = [];
  isDropBoxForState = false;
  pageTitle = 'Profile';
  isLoggedIn = false;
  cartBadgeCount = 0;
  cartProductList = [];

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

  onlineBusiness = [
    {name: "No", value: 0},
    {name: "Yes", value: 1}
  ];
  constructor(
    public formBuilder: FormBuilder,
    public cartSettingService: CartSettingService,
    public menuCtrl: MenuController,
    public storageService: StorageService,
    public db: DbService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.validationsform = this.formBuilder.group({
      first_name: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      last_name: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      address1: new FormControl('', Validators.compose([
        Validators.required
      ])),    
      address2: new FormControl('', Validators.compose([
        Validators.required
      ])),   
      city: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      post_code: new FormControl('', Validators.compose([
      ])),   
      state: new FormControl('', Validators.compose([
        Validators.required
      ])),   
      tel_phone: new FormControl('', Validators.compose([
        
      ])),   
      mobile_phone: new FormControl('', Validators.compose([
      ])),    
    
      confirm_password: new FormControl('', Validators.compose([
        Validators.required
      ])),                                      
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6)
      ])),
      company: new FormControl('', Validators.compose([
      ])),   
      position: new FormControl('', Validators.compose([
      ])),   
      fax: new FormControl('', Validators.compose([
        
      ])),   
      shop_phone: new FormControl('', Validators.compose([
      ])),   
      payment_method: new FormControl('', Validators.compose([
        
      ])),   
      business_structure: new FormControl('', Validators.compose([
        
      ])),   
      abn: new FormControl('', Validators.compose([
        
      ])),     
      comment: new FormControl('', Validators.compose([
        
      ])),       
      trading_years: new FormControl('', Validators.compose([
        
      ])),  
      online_business: new FormControl('', Validators.compose([
        
      ])),   
      domain_name: new FormControl('', Validators.compose([
        
      ])),  
      countrykey: new FormControl('', Validators.compose([
        
      ])),                             
    });

  }

  async ionViewWillEnter(){
    this.countryList = this.cartSettingService.countryList;
    this.stateList = this.cartSettingService.states_au;
    this.cartProductList = await this.storageService.getObject(config.cart_products);
    this.loginedUser = await this.storageService.getObject('loginedUser');

    if(this.cartProductList == null){
      this.cartProductList = [];
      this.cartBadgeCount = 0;
    }else
      this.cartBadgeCount = this.cartProductList.length;  

    if(!this.loginedUser){
      this.isLoggedIn = false;
    }else
      this.isLoggedIn = true;

    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){
        this.getProfileInfo();
      }
    });  
    
  }

  async getProfileInfo(){
    this.profileInfo = await this.db.getProfileInfo(this.loginedUser);

    if(this.profileInfo.countrykey == 463)
      this.isDropBoxForState = true;
    else
      this.isDropBoxForState = false;

    if(this.profileInfo.abn == "'0'") this.profileInfo.abn = '';
    if(this.profileInfo.position == "NULL") this.profileInfo.position = '';

    console.log(this.profileInfo);
    this.validationsform.setValue({
      email: this.profileInfo.email,
      password: this.profileInfo.password,
      confirm_password: '',
      first_name: this.profileInfo.first_name,
      last_name: this.profileInfo.last_name,
      post_code: this.profileInfo.post_code,
      tel_phone: this.profileInfo.tel_phone,
      mobile_phone: this.profileInfo.mobile_phone,
      address1: this.profileInfo.address1,
      address2: this.profileInfo.address2,
      city: this.profileInfo.city,
      state: this.profileInfo.state,
      company: this.profileInfo.company,
      position: this.profileInfo.position,
      fax: this.profileInfo.fax,
      shop_phone: this.profileInfo.shop_phone,
      payment_method: this.profileInfo.payment_method,
      business_structure: this.profileInfo.business_structure,
      abn: this.profileInfo.abn,
      comment: this.profileInfo.comment,
      trading_years: this.profileInfo.trading_years,
      online_business: this.profileInfo.online_business,
      domain_name: this.profileInfo.domain_name,
      countrykey: this.profileInfo.countrykey,
   });
  }
  changeCountry(e){
    var countryVal = e.detail.value;
    if(countryVal == 463)
      this.isDropBoxForState = true;
    else
      this.isDropBoxForState = false;
  }

  async submit(value){
    var update_query = "UPDATE Customer SET first_name = '" + value.first_name + "', last_name = '" + value.last_name + "', email = '" + value.email + "', zip = '" + value.post_code + "', ";
    update_query+= "phone = '" + value.tel_phone + "', mobile = '" + value.mobile_phone + "', address1 = '" + value.address1 + "', address2 = '" + value.address2 + "', ";
    update_query+= "city = '" + value.city + "', state = '" + value.state + "', company = '" + value.company + "', position = '" + value.position + "', ";
    update_query+= "fax = '" + value.fax + "', shop_phone = '" + value.shop_phone + "', payment_method = '" + value.payment_method + "', business_structure = '" + value.business_structure + "', ";
    update_query+= "abn = '" + value.abn + "', comment = '" + value.comment + "', trading_years = '" + value.trading_years + "', online_business = '" + value.online_business + "', ";
    update_query+= "domain_name = '" + value.domain_name + "', country = '" + value.countrykey + "' WHERE id = " + this.loginedUser.id;

    await this.db.updateProfileInfo(update_query);
    this.showToast("Your profile updated successfully.");
  }

  showToast(msg) {
    this.toastController
      .create({
        header: "",
        message: msg,
        position: "top",
        color: "dark",
        duration: 1500
      })
      .then(obj => {
        obj.present();
      });
  }
}
