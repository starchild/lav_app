import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/online/category/category.service';
import { DbService } from '../../services/sqlite/db.service'
import { CustomerService } from '../../services/online/customer/customer.service';
import {StorageService} from '../../services/storage/storage.service';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Platform, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { config } from 'src/app/config/config';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  prodcat_maxId : any;
  productCategory_maxId : any;
  loadingCtrl : any;
  isUpdatingCustomer = false;
  loginedUser : any;
  customerIdList = [];
  categorylist = [];
  loadMore_categories = [];
  img_dir = '';
  pageTitle = 'Shop All Categories';
  isLoggedIn = false;
  cartBadgeCount = 0;
  cartProductList = [];
  isLoading = false;
  from_limitVal = 0;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    private categoryService: CategoryService,
    public db: DbService,
    private webview: WebView,
    private storageService: StorageService,
    private file: File,
    public menuCtrl: MenuController,
    public customerService: CustomerService
  ) { }

  async ngOnInit() {
    this.img_dir = this.pathForImage(this.file.documentsDirectory + 'prod_cat_img/');
    this.loginedUser = await this.storageService.getObject('loginedUser');
    this.cartProductList = await this.storageService.getObject(config.cart_products);
    this.isLoading = true;

    if(this.cartProductList == null){
      this.cartProductList = [];
      this.cartBadgeCount = 0;
    }else
      this.cartBadgeCount = this.cartProductList.length;  

    if(!this.loginedUser){
      this.isLoggedIn = false;
      this.isLoading = false;
    }else{
      this.isLoggedIn = true;
      this.getCategoryList(false, "");
    }
  }

  async ionViewWillEnter(){


  }

  async getCategoryList(isFirstLoad, event){
    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){
        this.loadMore_categories = await this.db.getCategories(this.from_limitVal);
        for(var i=0; i<this.loadMore_categories.length; i++){
          this.loadMore_categories[i].image = await this.db.getCategoryImagesById(this.loadMore_categories[i].id);
          this.categorylist.push(this.loadMore_categories[i]);
        }
        console.log(this.categorylist);
        this.isLoading = false;
        if (isFirstLoad)
          event.target.complete();
          
        this.from_limitVal = this.from_limitVal + 6;  
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

  async openMenu() {
    this.loginedUser = await this.storageService.getObject("loginedUser");

    if(this.loginedUser){
      this.menuCtrl.enable(true, 'loggedin_customMenu');
      this.menuCtrl.open('loggedin_customMenu');
    }else{
      this.menuCtrl.enable(true, 'customMenu');
      this.menuCtrl.open('customMenu');
  
    }
  }
  async loadMore(event){
    this.getCategoryList(true, event);
  }
}
