import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/sqlite/db.service'
import {StorageService} from '../../services/storage/storage.service';
import { Platform, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { Router} from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  customerlist = [];
  customer_sectionlist = [];
  loadMore_customerList = [];
  loginedUser : any;
  maxId = 0;
  isLoading = false;
  from_limitVal = 0;

  constructor(
    private router: Router,
    public db: DbService,
    private storageService: StorageService,
    public menuCtrl: MenuController,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    this.loginedUser = await this.storageService.getObject('loginedUser');

    this.isLoading = true;
    this.getCustomerList(false, "");
  }

  async loadMore(event){
    this.getCustomerList(true, event);
  }

  async getCustomerList(isFirstLoad, event){
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){

        this.loadMore_customerList = await this.db.getCustomers(this.loginedUser.id, this.from_limitVal);
        for(var i=0; i<this.loadMore_customerList.length; i++){
          this.customerlist.push(this.loadMore_customerList[i]);
        }
        this.isLoading = false;
        if (isFirstLoad)
          event.target.complete();
          
        this.from_limitVal = this.from_limitVal + 30;  
      }
    });  
  }
  gotoSignup(){
    this.router.navigate(["/signup-first"]);
  }
  async login(customer){
    this.storageService.setObject("loginedUser", customer);
    this.router.navigate(['/profile']);
  }

  async openMenu() {
    this.menuCtrl.enable(true, 'loggedin_customMenu');
    this.menuCtrl.open('loggedin_customMenu');
  }
}
