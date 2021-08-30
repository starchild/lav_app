import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Platform, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { DbService } from '../../services/sqlite/db.service';
import {StorageService} from '../../services/storage/storage.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/online/customer/customer.service';
import { CategoryService } from '../../services/online/category/category.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validationsform: FormGroup;
  rowHeight : any;
  rowHeight1 : any;
  isLoadingFromOnline = false;
  isSigning = false;
  isUpdating = false;
  loadingCtrl : any;
  prodcat_maxId : any;
  productCategory_maxId : any;

  constructor(
    public formBuilder: FormBuilder,
    public plt: Platform,
    public db: DbService,
    public router: Router,
    public loadingController: LoadingController,
    public menuCtrl: MenuController,
    public storageService: StorageService,
    public alertController: AlertController,
    public categoryService: CategoryService,
    public customerService: CustomerService
  ) { }

  ngOnInit() {
    this.rowHeight = this.plt.height() / 3 + 'px';
    this.rowHeight1 = this.plt.height() * 2 / 3 -100 + 'px';

    this.validationsform = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
    this.validationsform.setValue({
      email: 'tim@weblife.com.au',
      password: 'tester'
   });
  }

  async ionViewWillEnter(){

  }

  async trySignin(value){
    this.isSigning = true;
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){
        this.db.getAgentByEmailAndPwd(value).then(async (agentInfo) => {
          this.isSigning = false;
          this.storageService.setObject("loginedUser", agentInfo);
          this.router.navigate(["/home"]);
        },
        (err) => {
          console.log(err);
          this.isSigning = false;
          this.presentAlert("Invalid login info.");
        });
      }
    });
  }

  gotoSignup(){
    this.router.navigate(["/signup-first"]);
  }
  
  async openMenu() {
    this.menuCtrl.enable(true, 'customMenu');
    this.menuCtrl.open('customMenu');
  }
  async presentAlert(value) {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 3000,
      message: value,
      mode: 'ios'
    });
    await loading.present();
  }


}
//ionic cordova run ios --target="A2686E38-C7E4-44EF-9E96-B7C4C3DD4DB7" --livereload    ddea53fca71d5bc7c8cb2792f3f047dfed650d3b
