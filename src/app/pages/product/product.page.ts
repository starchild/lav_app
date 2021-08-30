import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { DbService } from '../../services/sqlite/db.service'
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {  MenuController } from '@ionic/angular';
import {StorageService} from '../../services/storage/storage.service';
import { config } from 'src/app/config/config';
import {  ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  isLoading = false;
  category_id : any;
  productList = [];
  img_dir = '';
  from_limitVal = 0;
  loadMore_productList = [];
  loginedUser : any;
  cartProductList = [];
  cartBadgeCount = 0;
  isLoggedIn = false;
  qty_dropdown = "";
  qty_dropdownList = [];
  placeholder_qty = "";
  pageTitle = 'Products';
  selectedQty = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public db: DbService,
    private file: File,
    public menuCtrl: MenuController,
    public storageService: StorageService,
    private webview: WebView,
    public toastController: ToastController
  ) { }

  async ngOnInit() {
    this.loginedUser = await this.storageService.getObject('loginedUser');
    this.isLoading = true;

    this.img_dir = this.pathForImage(this.file.documentsDirectory + 'product_img/');
    if(!this.loginedUser){
      this.isLoggedIn = false;
      this.isLoading = false;
    }else{
      this.isLoggedIn = true;
      this.route.params.subscribe(
        data => {
          this.category_id = data.id;
          this.getProductList(false, "");
        }
      );
   }
  }

  async ionViewWillEnter(){
    this.cartProductList = await this.storageService.getObject(config.cart_products);

    if(this.cartProductList == null){
      this.cartProductList = [];
      this.cartBadgeCount = 0;
    }else
      this.cartBadgeCount = this.cartProductList.length;  
  }

  async getProductList(isFirstLoad, event){
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){

        this.loadMore_productList = await this.db.getProducts( this.category_id, this.loginedUser.group_id, this.from_limitVal);
        for(var i=0; i<this.loadMore_productList.length; i++){
          this.loadMore_productList[i].qty_dropdownList = this.getQtyList(this.loadMore_productList[i]);
          this.loadMore_productList[i].placeholder_qty = this.placeholder_qty;
          this.loadMore_productList[i].bulkPrice = this.loadMore_productList[i].productPrice;
          this.loadMore_productList[i].image = await this.db.getProductImagesById(this.loadMore_productList[i].productId);
          
          this.productList.push(this.loadMore_productList[i]);
          
        }
        this.isLoading = false;
        if (isFirstLoad)
          event.target.complete();
          
        this.from_limitVal = this.from_limitVal + 15;  
      }
    });  
  }
  async loadMore(event){
    this.getProductList(true, event);
  }

  async openMenu() {
    this.menuCtrl.enable(true, 'loggedin_customMenu');
    this.menuCtrl.open('loggedin_customMenu');

  }

  async addToCart(product){
    if(this.selectedQty == 0)
      this.selectedQty = product.productMinQty;

    product.qty = this.selectedQty;

    if(product.bulkPrice)
      product.bulkPrice = product.bulkPrice;
    else
      product.bulkPrice = product.productPrice;

    product.amount = product.bulkPrice * product.qty;

    if(this.cartProductList.length > 0){
      var alreadyProductObj = this.cartProductList.find(function(cartProduct, index) {
        if(cartProduct.productId == product.productId){
          cartProduct.qty = cartProduct.qty + product.qty;
          cartProduct.amount = cartProduct.qty * cartProduct.bulkPrice;
          return true;
        }
      });
      if(alreadyProductObj == undefined)
        this.cartProductList.push(product);
    }else
      this.cartProductList.push(product);
      
    await this.storageService.setObject(config.cart_products, this.cartProductList);
    this.cartBadgeCount = this.cartProductList.length;  

    this.showToast();
  }

  changePrice(e, productIndex){
    this.selectedQty = e.detail.value;
    if(this.selectedQty >= this.productList[productIndex].productQtySlab && this.productList[productIndex].productQtySlab > 0)
      this.productList[productIndex].bulkPrice = this.productList[productIndex].productPriceSlab;
    else
      this.productList[productIndex].bulkPrice = this.productList[productIndex].productPrice;

      console.log(this.productList[productIndex].bulkPrice);
  }

  gotoDetail(product){
    let navigationExtras: NavigationExtras = {
      state: {
        product: product
      }
    };    
    this.router.navigate(['/product-detail'], navigationExtras);
  } 
  
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  getQtyList(product){
    this.qty_dropdown = "";
    var minQty = product.productMinQty;

    this.placeholder_qty = minQty;
    var qtyList = [];
    for(var i= minQty; i<100; i++){
      if(product.productCartonQty == i)
        this.placeholder_qty = i;

      qtyList.push(i);
      if(i >= product.productCartonQty && product.productCartonQty > 1)
        i += product.productCartonQty;
      else
        i += minQty  
    }
   return qtyList;
  }
  showToast() {
    this.toastController.create({
      header: '',
      message: 'Added to Cart sucessfully!',
      position: 'top',
      color: 'dark',
      duration: 1500
    }).then((obj) => {
      obj.present();
    });
  }
}
