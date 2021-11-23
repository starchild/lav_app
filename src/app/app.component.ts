import { Component } from "@angular/core";
import { Platform, LoadingController, AlertController } from "@ionic/angular";

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DbService } from "./services/sqlite/db.service";
import { CustomerService } from "./services/online/customer/customer.service";
import { StorageService } from "./services/storage/storage.service";
import { ImportService } from "./services/online/import/import.service";
import { ExportService } from "./services/online/export/export.service";

import {
  FileTransfer,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { config } from "./config/config";
import { Router } from "@angular/router";
import { CartSettingService } from "./services/global-carttsetting/cart-setting.service";

const siteurl = "https://cdn.lavida.com.au";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  agent_regdate: any;
  checkExistDir: any;
  loading: any;
  productImageList = [];
  categoryImageList = [];
  bannerImageList = [];
  cartSettingList = [];
  loginedUser: any;
  loginState = false;
  isAccountSubmenus = false;
  public appMenus = [
    {
      title: "Home",
      url: "/home"
    },
    {
      title: "New Arrivals",
      url: "/new-arrival"
    },
    {
      title: "Shop All Categories",
      url: "/category"
    },
    {
      title: "Login",
      url: "/login"
    }
  ];

  public loggedin_appMenus = [
    {
      title: "Home",
      url: "/home"
    },
    {
      title: "New Arrivals",
      url: "/new-arrival"
    },
    {
      title: "Shop All Categories",
      url: "/category"
    },
    {
      title: "On Special",
      url: "/special"
    },
    {
      title: "Clearance",
      url: "/clearance"
    }
  ];
  public account_subMenus = [
    {
      title: "Profile",
      icon: "person",
      url: "/profile"
    },
    {
      title: "My Customers",
      icon: "people",
      url: "/customer"
    },
    {
      title: "Saved Orders",
      icon: "save",
      url: "/savedorders"
    },
    {
      title: "Order History",
      icon: "alarm",
      url: "/checkoutlist"
    },
    {
      title: "Sync To Online",
      icon: "cloud-upload",
      url: "/toserver"
    },
    {
      title: "Sync From Online",
      icon: "cloud-download",
      url: "/fromserver"
    }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public db: DbService,
    public loadingController: LoadingController,
    private storageService: StorageService,
    public customerService: CustomerService,
    public importService: ImportService,
    public exportService: ExportService,
    private file: File,
    private transfer: FileTransfer,
    private router: Router,
    public alertController: AlertController,
    public cartSettingService: CartSettingService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initialLocalDatabase();
    });
  }

  async initialLocalDatabase() {
    this.db.getDatabaseState().subscribe(async res => {
      if (res) {
        this.bannerImageList = await this.db.getHomeSlider();
        await this.downloadBannerImages(this.bannerImageList);

        this.productImageList = await this.db.getProductImages();
        await this.downloadProductImages(this.productImageList);

        this.categoryImageList = await this.db.getCategoryImages();
        await this.downloadCategoryImages(this.categoryImageList);


        this.loginedUser = await this.storageService.getObject("loginedUser");

        if (this.loginedUser){
          this.cartSettingList = await this.db.getAllGlobalCartSetting();
          this.cartSettingService.setGlobalInfo(this.cartSettingList);
          this.router.navigate(["/home"]);
  
        }
        else 
          this.router.navigate(["/login"]);
      }
    });
  }

  async downloadBannerImages(imageData) {
    var img_initialized = await this.storageService.getObject(
      "bannerimg_initialized"
    );
    if (img_initialized) return;

    const loading = await this.loadingController.create({
      message: "Downloading Banner Images..."
    });
    await loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    for (var i = 0; i < imageData.length; i++) {
      let url = siteurl + "/upload/flash_banner_img/" + imageData[i].name;

      await this.file.checkFile(this.file.documentsDirectory + "banner_img/", imageData[i].name + "/").then(async result => {
           console.log("already downloaded image", imageData[i].name);
      }).catch(async err => {
        console.log("downloading banner images", imageData[i].name);
        await fileTransfer.download(url, this.file.documentsDirectory + "banner_img/" + imageData[i].name).catch(async err => {console.log(err)});;
      });
    }
    this.storageService.setObject("bannerimg_initialized", true);
    loading.dismiss();
  }
  //get and download products and categories images
  async downloadProductImages(imageData) {
    var img_initialized = await this.storageService.getObject("prodimg_initialized");
    if(img_initialized) return;
    const loading = await this.loadingController.create({
      message: "Downloading Product Images..."
    });
    await loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    // for (var i = 0; i < imageData.length; i++) {
     for (var i = 0; i < 10; i++) {

      let url = siteurl + "/upload/product_img/app/" + imageData[i].name;

      await this.file.checkFile(this.file.documentsDirectory + "product_img/", imageData[i].name + "/").then(async result => {
      }).catch(async err => {
        await fileTransfer.download(url, this.file.documentsDirectory + 'product_img/' + imageData[i].name).catch(async err => {console.log(err)});
      });
    }
    this.storageService.setObject("prodimg_initialized", true);
    loading.dismiss();
  }

  async downloadCategoryImages(imageData) {
    var img_initialized = await this.storageService.getObject(
      "catimg_initialized"
    );
    if (img_initialized) return;

    const loading = await this.loadingController.create({
      message: "Downloading Category Images..."
    });
    await loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    for (var i = 0; i < imageData.length; i++) {
      if (imageData[i].name != "NULL") {
        let url = siteurl + "/upload/prod_cat_img/" + imageData[i].name;

        await this.file.checkFile(this.file.documentsDirectory + "prod_cat_img/", imageData[i].name + "/").then(async result => {
          console.log("already downloaded image", imageData[i].name);
        }).catch(async err => {
          console.log("downloading category images", imageData[i].name);
          await fileTransfer.download(url, this.file.documentsDirectory + "prod_cat_img/" + imageData[i].name).catch(async err => {console.log(err)});;
        });        
      }
    }
    this.storageService.setObject("catimg_initialized", true);
    loading.dismiss();
  }

  gotoPage(url) {
    this.router.navigate([url]);
  }

  gotoAccountSubPage(url) {
    if(url == "/fromserver")
      this.syncFromServerConfirm();
    else if(url == '/toserver')  
      this.syncToServerConfirm();
    else  
      this.router.navigate([url]);
  }


  async syncFromServerConfirm() {
    this.alertController.create({
      header: 'Sync Data',
      message: 'Sync local data from server',
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
          }
        },
        {
          text: 'Sync',
          handler: (data: any) => {
            this.importService.checkExistNewCategory();
          }
        }
      ],
      backdropDismiss: false

    }).then(res => {
      res.present();
    });
  }
  async syncToServerConfirm() {
    this.alertController.create({
      header: 'Sync Data',
      message: 'Sync local data to server',
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
          }
        },
        {
          text: 'Sync',
          handler: (data: any) => {
            this.exportService.exportToServer();
          }
        }
      ],
      backdropDismiss: false

    }).then(res => {
      res.present();
    });
  }

  logout(){
    this.storageService.removeItem("loginedUser");
    this.router.navigate(["/login"]);
  }
}
//ionic cordova run ios --target="A2686E38-C7E4-44EF-9E96-B7C4C3DD4DB7" --livereload
