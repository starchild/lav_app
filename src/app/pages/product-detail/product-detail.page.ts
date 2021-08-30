import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from "@angular/common";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import * as JsBarcode from "JsBarcode";
import {StorageService} from '../../services/storage/storage.service';
import { config } from 'src/app/config/config';
import {  ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  product : any;
  img_dir = '';
  slideOpts = {
    initialSlide: 0,
    speed: 300,
    slidesPerView: 1,
    autoplay: true,
    freeMode: false
  };
  selectedQty = 0;
  cartProductList = [];

  @ViewChild('barCode') barCode: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public file: File,
    public webview: WebView,
    public storageService: StorageService,
    public toastController: ToastController
  ) { }

  async ngOnInit() {
    
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.img_dir = this.pathForImage(this.file.documentsDirectory + 'product_img/');
        this.product = this.router.getCurrentNavigation().extras.state.product;
        this.product.bulkPrice = this.product.productPrice;
        this.cartProductList = await this.storageService.getObject(config.cart_products);
        if(this.cartProductList == null)
          this.cartProductList = [];
      }
    });

  }
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.generateBarcode(this.product.productBarCode); 

  //   }, 1000);
  // }
  async ionViewWillEnter(){
  }
  changePrice(e){
    this.selectedQty = e.detail.value;
    if(this.selectedQty >= this.product.productQtySlab && this.product.productQtySlab > 0)
      this.product.bulkPrice = this.product.productPriceSlab;
    else
      this.product.bulkPrice = this.product.productPrice;
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
    // this.cartBadgeCount = this.cartProductList.length;  

    this.showToast();
  }
  generateBarcode(barcodeValue){
    JsBarcode(this.barCode.nativeElement, barcodeValue,
      {
        displayValue: false
      });
  }
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  back(){
    this.location.back();
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
