import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';
import { DbService } from '../../services/sqlite/db.service'
import { config } from 'src/app/config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-savedorders',
  templateUrl: './savedorders.page.html',
  styleUrls: ['./savedorders.page.scss'],
})
export class SavedordersPage implements OnInit {
  loginedUser : any;
  savedOrderList = [];
  savedOrderDetails = [];
  orderDetails = [];
  productsInOrderDetail = [];
  pageTitle = 'Saved Orders';
  isLoggedIn = false;
  cartProductList = [];
  cartBadgeCount = 0;
  loadMore_OrderList = [];
  from_limitVal = 0;
  qty_dropdown = "";

  expandHeight = 1200 + "px";
  constructor(
    public storageService: StorageService,
    public db: DbService,
    public router: Router,
  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter(){

    this.loginedUser = await this.storageService.getObject("loginedUser");
    if(!this.loginedUser){
      this.isLoggedIn = false;
    }else
      this.isLoggedIn = true;
      
    this.from_limitVal = 0;
    this.savedOrderList = [];

    this.getSavedOrders(false, "");

    this.cartProductList = await this.storageService.getObject(config.cart_products);

    if(this.cartProductList == null){
      this.cartProductList = [];
      this.cartBadgeCount = 0;
    }else
      this.cartBadgeCount = this.cartProductList.length;  


  }

  async getSavedOrders(isFirstLoad, event){
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){

        this.loadMore_OrderList = await this.db.loadSavedOrders(this.loginedUser.id, this.from_limitVal);
        for(var i=0; i<this.loadMore_OrderList.length; i++){
          this.loadMore_OrderList[i].expanded = false;
          this.loadMore_OrderList[i].detail_orderdate = this.loadMore_OrderList[i].orderDate.substring(0, 10);
          this.loadMore_OrderList[i].details = [];
          this.savedOrderList.push(this.loadMore_OrderList[i]);
        }
        if (isFirstLoad)
          event.target.complete();

        this.from_limitVal = this.from_limitVal + 30;  
      }
    });  
  }

  async loadMore(event){
    this.getSavedOrders(true, event);
  }

  async getSavedOrderDetails(order, saveorderIndex){
    if(order.expanded){
      order.expanded = false;
    }else{
      order.expanded = true;
    }
    this.savedOrderDetails = await this.db.loadSavedOrderDetails(order.orderId);
    this.savedOrderList[saveorderIndex].details = this.savedOrderDetails;
  }

  async mergeOrder(order){
    this.productsInOrderDetail = await this.db.getProductsInOrderDetail(order.orderId);
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
    this.productsInOrderDetail = await this.db.getProductsInOrderDetail(order.orderId);

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

  async deleteSavedOrder(order, saveorderIndex){
    var str_deleteorder = "DELETE FROM saveordermaster  WHERE id =" + order.orderId;
    await this.db.delete(str_deleteorder);

    var str_deleteorderdetail = "DELETE FROM saveorderdetails  WHERE order_id =" + order.orderId;
    await this.db.delete(str_deleteorderdetail);    

    if (saveorderIndex > -1) {
      this.savedOrderList.splice(saveorderIndex, 1);
    }

  }

  getQtyList(product){
    this.qty_dropdown = "";
    var minQty = product.productMinQty;

    var qtyList = [];
    for(var i= minQty; i<100; i++){

      qtyList.push(i);
      if(i >= product.productCartonQty && product.productCartonQty > 1)
        i += product.productCartonQty;
      else
        i += minQty  
    }
   return qtyList;
  }
}
