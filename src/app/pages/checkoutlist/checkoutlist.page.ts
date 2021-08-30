import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';
import { DbService } from '../../services/sqlite/db.service'
import { config } from 'src/app/config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkoutlist',
  templateUrl: './checkoutlist.page.html',
  styleUrls: ['./checkoutlist.page.scss'],
})
export class CheckoutlistPage implements OnInit {
  loginedUser : any;
  checkoutOrderList = [];
  from_limitVal = 0;
  cartProductList = [];
  cartBadgeCount = 0;
  loadMore_OrderList = [];
  checkoutOrderDetails = [];
  pageTitle = 'Order History';
  expandHeight = 1200 + "px";
  productsInOrderDetail = [];
  qty_dropdown = "";
  isLoggedIn = false;
  
  constructor(
    private storageService: StorageService,
    public db: DbService,
    public router: Router,

  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter(){

    this.loginedUser = await this.storageService.getObject("loginedUser");
    this.from_limitVal = 0;
    this.checkoutOrderList = [];

    this.getCheckoutOrders(false, "");

    this.cartProductList = await this.storageService.getObject(config.cart_products);

    if(this.cartProductList == null){
      this.cartProductList = [];
      this.cartBadgeCount = 0;
    }else
      this.cartBadgeCount = this.cartProductList.length;  

    if(!this.loginedUser){
      this.isLoggedIn = false;
    }else
      this.isLoggedIn = true;  
  }

  async getCheckoutOrders(isFirstLoad, event){
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){

        this.loadMore_OrderList = await this.db.getCheckoutOrders(this.loginedUser.id, this.from_limitVal);
        for(var i=0; i<this.loadMore_OrderList.length; i++){
          this.loadMore_OrderList[i].expanded = false;
          this.loadMore_OrderList[i].details = [];
          this.loadMore_OrderList[i].orderDate = this.loadMore_OrderList[i].orderDate.substring(0, 10);

          if(this.loadMore_OrderList[i].status == 0)
            this.loadMore_OrderList[i].statusText = "Confirmed";
          if(this.loadMore_OrderList[i].status == 1)
            this.loadMore_OrderList[i].statusText = "Processing";
          if(this.loadMore_OrderList[i].status == 2)
            this.loadMore_OrderList[i].statusText = "Dispatched";

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

  async getCheckoutOrderDetails(order, index){
    if(order.expanded){
      order.expanded = false;
    }else{
      order.expanded = true;
    }
    this.checkoutOrderDetails = await this.db.loadCheckoutOrderDetails(order.orderId);
    this.checkoutOrderList[index].details = this.checkoutOrderDetails;
  }

  async mergeOrder(order){
    this.productsInOrderDetail = await this.db.getProductsInOrderMasterDetail(order.orderId);
    console.log(this.productsInOrderDetail);
    for(var i=0; i<this.productsInOrderDetail.length; i++){
      this.productsInOrderDetail[i].qty_dropdownList = this.getQtyList(this.productsInOrderDetail[i]);
      this.productsInOrderDetail[i].bulkPrice = this.productsInOrderDetail[i].productPrice;
      this.productsInOrderDetail[i].amount = this.productsInOrderDetail[i].bulkPrice * this.productsInOrderDetail[i].qty;
      this.productsInOrderDetail[i].image = await this.db.getProductImagesById(this.productsInOrderDetail[i].productId);

      var productIdInOrderDetail = this.productsInOrderDetail[i];
      if(this.cartProductList.length > 0){
        var alreadyProductObj = this.cartProductList.find(function(cartProduct, index) {
          if(cartProduct.productId == productIdInOrderDetail.productId){
            cartProduct.qty = cartProduct.qty + productIdInOrderDetail.qty;
            cartProduct.amount = cartProduct.qty * cartProduct.bulkPrice;
            return true;
          }
        });
        if(alreadyProductObj == undefined)
          this.cartProductList.push(this.productsInOrderDetail[i]);
      }else
        this.cartProductList.push(this.productsInOrderDetail[i]);
    }

    await this.storageService.setObject(config.cart_products, this.cartProductList);
    this.cartBadgeCount = this.cartProductList.length;  
    this.router.navigate(['/cart']);
  }

  async regenerateOrder(order){
    this.productsInOrderDetail = await this.db.getProductsInOrderMasterDetail(order.orderId);

    for(var i=0; i<this.productsInOrderDetail.length; i++){
      this.productsInOrderDetail[i].qty_dropdownList = this.getQtyList(this.productsInOrderDetail[i]);
      this.productsInOrderDetail[i].bulkPrice = this.productsInOrderDetail[i].productPrice;
      this.productsInOrderDetail[i].amount = this.productsInOrderDetail[i].bulkPrice * this.productsInOrderDetail[i].qty;
      this.productsInOrderDetail[i].image = await this.db.getProductImagesById(this.productsInOrderDetail[i].productId);
    }  
    this.cartProductList = this.productsInOrderDetail;
    await this.storageService.setObject(config.cart_products, this.cartProductList);
    this.cartBadgeCount = this.cartProductList.length;  
    this.router.navigate(['/cart']);
  }  

  getQtyList(product){
    this.qty_dropdown = "";
    var minQty = product.productMinQty;

    var qtyList = [];
    for(var i= minQty; i<100; i++){
      // if(product.productCartonQty == i)
      //   this.placeholder_qty = i;

      qtyList.push(i);
      if(i >= product.productCartonQty && product.productCartonQty > 1)
        i = i + product.productCartonQty -1;
      else
        i = i + minQty -1;  
    }
   return qtyList;
  }}
