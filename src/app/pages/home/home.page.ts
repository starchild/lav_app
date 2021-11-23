import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DbService } from '../../services/sqlite/db.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import {StorageService} from '../../services/storage/storage.service';
import { config } from 'src/app/config/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  rowHeight : any;
  rowButtonSectionHeight : any;
  isUpdating = false;
  loadingCtrl : any;
  prodcat_maxId : any;
  productCategory_maxId : any;
  img_dir = '';
  cartBadgeCount = 0;

  homeSliders = [];
  loginedUserInfo : any;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    speed: 500
  };
  pageTitle = 'Home';
  isLoggedIn = false;
  cartProductList = [];
  isShowSearchBar = true;
  constructor(
    public plt: Platform,
    public db: DbService,
    public webview: WebView,
    public file: File,
    public storageService: StorageService,
  ) { }

  ngOnInit() {
    this.rowHeight = this.plt.height() / 2 + 'px';
    this.rowButtonSectionHeight = this.plt.height() / 6 + 'px';
  }

  async ionViewWillEnter(){
    this.img_dir = this.pathForImage(this.file.documentsDirectory + 'banner_img/');
    this.loginedUserInfo = await this.storageService.getObject("loginedUser");
    this.isShowSearchBar = false;
    if(this.loginedUserInfo)
      this.isLoggedIn = true;
      
    
    this.cartProductList = await this.storageService.getObject(config.cart_products);

    if(this.cartProductList == null){
      this.cartProductList = [];
      this.cartBadgeCount = 0;
    }else
      this.cartBadgeCount = this.cartProductList.length;    
    
    this.getSliders();
  }

  async getSliders(){
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){
        this.homeSliders = await this.db.getHomeSlider();
      }
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

}
