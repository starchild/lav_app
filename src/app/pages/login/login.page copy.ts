import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Platform, LoadingController, AlertController, MenuController, ModalController } from '@ionic/angular';
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
    public modalController: ModalController,
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
    //this.isUpdating = true; 
    //this.syncConfirmAlert();
  }

  //Started sync agent table data from servere---------------
  async checkAndUpdateAgentSqlite(){  
    this.loadingCtrl = await this.loadingController.create({
      message: 'Syncing data...',
    });
    await this.loadingCtrl.present();

    var str_query = "SELECT * FROM Customer ORDER BY reg_date DESC LIMIT 1";

    this.db.getDatabaseState().subscribe(async (res) => {
      if(res){
        var last_regdate = await this.db.getLastRegDate(str_query);
        this.updateAgentSqliteFromServer(last_regdate.reg_date);
      }
    });

  }

  async updateAgentSqliteFromServer(last_regdate){
    this.customerService.getAgentList(last_regdate).subscribe( async (result) => {
      console.log(result.data.length);
      if(result.data.length > 0){
        await this.addAgentsToSqlite(result.data);
      }
      this.checkExistNewCategory();

    },
    (err) => {
      this.loadingCtrl.dismiss();
      this.isUpdating = false;
      alert("Error: Sync agent data.");
    });
  }

  addAgentsToSqlite(agentlist){
    var str_query = "INSERT INTO Customer (id, distributor_businessName, first_name, last_name, email, password, status, is_sales_rep, parent_id, parent_id_with_data, user_type, custom_zones, cc_number, camtech_trigger_key, reg_date) VALUES ";

    var rowArgs = [];
    var data = [];
    agentlist.forEach(function (agent) {
      rowArgs.push("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      data = [agent.id, agent.distributor_businessName, agent.first_name, agent.last_name, agent.email, agent.password, agent.status, agent.is_sales_rep, agent.parent_id, agent.user_type, agent.parent_id_with_data, agent.custom_zones, agent.cc_number, agent.camtech_trigger_key, agent.reg_date];
    });
    str_query += rowArgs.join(", ");
    return this.db.addToSqlite(str_query, data);  
  }
  //End synced agent table from server.

  //Start synced ProdCat table from server.
  async checkExistNewCategory(){
    this.loadingCtrl = await this.loadingController.create({
      message: 'Syncing data...',
    });
    await this.loadingCtrl.present();
    
    var str_prodCatquery = "SELECT MAX(id) as maxId FROM ProdCat LIMIT 1";
    var str_prdductCategoryQuery = "SELECT MAX(id) as maxId FROM ProductCategory LIMIT 1";

    this.prodcat_maxId = await this.db.getMaxId(str_prodCatquery);
    this.productCategory_maxId = await this.db.getMaxId(str_prdductCategoryQuery);

    this.updateCategorySqlite(this.prodcat_maxId.maxId, this.productCategory_maxId.maxId);

  }
  async updateCategorySqlite(prodcat_maxId, productCategory_maxId){
    
    if(prodcat_maxId == null)
      prodcat_maxId = 0;

    if(productCategory_maxId == null)
      productCategory_maxId = 0;
    
    this.categoryService.getProdCatFromServer(prodcat_maxId, productCategory_maxId).subscribe( async (result) => {
      
      if(result.prodcatlist.length > 0)
        await this.addProdCatToSqlite(result.prodcatlist);

      if(result.productCategories.length > 0)
        await this.addProductCategoriesToSqlite(result.productCategories);

      this.loadingCtrl.dismiss();  
      this.isUpdating = false;

    },(err) => {
      this.loadingCtrl.dismiss();
      this.isUpdating = false;
      alert("Error: Sync category data.");

    });
  }

  addProdCatToSqlite(prodcatlist){
    var str_query = "INSERT INTO ProdCat (id, parent_id, name, description, display_title, image) VALUES ";
    
    var rowArgs = [];
    var data = [];
    prodcatlist.forEach(function (prodcat) {
      rowArgs.push("(?, ?, ?, ?, ?, ?)");
      data = [prodcat.id, prodcat.parent_id, prodcat.name, prodcat.description, prodcat.display_title, prodcat.image];
    });
    str_query += rowArgs.join(", ");
    return this.db.addToSqlite(str_query, data);
  }

  addProductCategoriesToSqlite(productCategories){
    var str_query = "INSERT INTO ProductCategory (id, product_id, category_id, product_code) VALUES ";

    var rowArgs = [];
    var data = [];
    productCategories.forEach(function (productCategory) {
      rowArgs.push("(?, ?, ?, ?)");
      data = [productCategory.id, productCategory.product_id, productCategory.category_id, productCategory.product_code];
    });
    str_query += rowArgs.join(", ");
    return this.db.addToSqlite(str_query, data);
  }
  //End synced category table from server.

  async trySignin(value){
    this.isSigning = true;
    this.db.getAgentByEmailAndPwd(value).then(async (agentInfo) => {
      console.log(agentInfo);
      this.isSigning = false;
      this.storageService.setObject("loginedInfo", agentInfo);
      //this.router.navigate(['/tablinks/category']);   
      await this.modalController.dismiss();
    },
    (err) => {
      console.log(err);
      this.isSigning = false;
      this.presentAlert("Invalid login info.");
    });
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

  syncConfirmAlert() {
    this.alertController.create({
      header: 'Sync Data',
      message: 'Sync local data from server',
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            this.isUpdating = false; 
          }
        },
        {
          text: 'Update',
          handler: (data: any) => {
            console.log('Saved Information', data);
            this.checkExistNewCategory();
          }
        }
      ],
      backdropDismiss: false

    }).then(res => {
      res.present();
    });
  }
  openMenu() {
    this.menuCtrl.enable(true, 'customMenu');
    this.menuCtrl.open('customMenu');
  }
}
//ionic cordova run ios --target="A2686E38-C7E4-44EF-9E96-B7C4C3DD4DB7" --livereload    ddea53fca71d5bc7c8cb2792f3f047dfed650d3b
