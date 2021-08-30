import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';
import { DbService } from '../../services/sqlite/db.service'
import { config } from 'src/app/config/config';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  loginedUser : any;
  checkoutOrderList = [];
  from_limitVal = 0;
  cartProductList = [];
  cartBadgeCount = 0;
  loadMore_OrderList = [];
  checkoutOrderDetails = [];
  pageTitle = 'Order History';

  constructor(
    private storageService: StorageService,
    public db: DbService,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){

    this.loginedUser = await this.storageService.getObject("loginedUser");
    this.from_limitVal = 0;

    this.getCheckoutOrders(false, "");

    this.cartProductList = await this.storageService.getObject(config.cart_products);

    if(this.cartProductList == null){
      this.cartProductList = [];
      this.cartBadgeCount = 0;
    }else
      this.cartBadgeCount = this.cartProductList.length;  


  }
  async getCheckoutOrders(isFirstLoad, event){
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){

        this.loadMore_OrderList = await this.db.getCheckoutOrders(this.loginedUser.id, this.from_limitVal);
        for(var i=0; i<this.loadMore_OrderList.length; i++){
          this.checkoutOrderList.push(this.loadMore_OrderList[i]);
        }
        if (isFirstLoad)
          event.target.complete();

        this.from_limitVal = this.from_limitVal + 30;  
        console.log(this.checkoutOrderList);
      }
    });  
  }

  async loadMore(event){
    this.getCheckoutOrders(true, event);
  }

  async getCheckoutOrderDetails(order){
    this.checkoutOrderDetails = await this.db.loadCheckoutOrderDetails(order.orderId);
    console.log(this.checkoutOrderDetails);
  }

}
