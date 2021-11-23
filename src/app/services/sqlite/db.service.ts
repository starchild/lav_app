// db.service.ts

import { Injectable } from '@angular/core';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {StorageService} from '../storage/storage.service';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;

  images = new BehaviorSubject([]);
  reg_dateList = new BehaviorSubject([]);
  prodcat_maxIdList = new BehaviorSubject([]);
  productCategory_maxIdList = new BehaviorSubject([]);
  maxIdList = new BehaviorSubject([]);
  regdate = [];
  
  reg_date_sqlite: any;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform, 
    private sqlite: SQLite, 
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    private storageService: StorageService,
    private file: File,
    private transfer: FileTransfer,
    private sqliteDbCopy: SqliteDbCopy,
    public loadingController: LoadingController,

  ) {
    this.initialLocalDatabase();
  }

  async initialLocalDatabase() {

    //this.storageService.removeItem('db_exist');

    let db_exist = await this.storageService.getString('db_exist');
    console.log("db_exist", db_exist);

    if(db_exist){
      this.openDatabase();
    }else{  
      this.file.checkDir(this.file.documentsDirectory, 'lavida').then(async(result) => {
        this.downloadAndCopyLocalDB();      
      }).catch(async (err) =>{
        this.file.createDir(this.file.documentsDirectory, 'lavida', true).then(async (res)=>{
          this.downloadAndCopyLocalDB();   
        });
      });
    }  
  }

  async downloadAndCopyLocalDB(){
    

    await this.file.copyFile(this.file.applicationDirectory + 'www/assets/', 'lavida.db', this.file.documentsDirectory + 'lavida/', 'lavida.db');
    console.log("copyDbFromStorage");

    this.sqliteDbCopy.copyDbFromStorage('lavida.db', 0, this.file.documentsDirectory + 'lavida/lavida.db', false).then(async (res: any) => {
     
      await this.file.removeFile(this.file.documentsDirectory + 'lavida/', 'lavida.db');
      this.storageService.setString('db_exist', 'done');

      this.openDatabase();

    }).catch((error: any) =>{
      console.error(error);
      alert("Failed Create database");
    });
  }

  
  openDatabase(){
    this.sqlite.create({
      name: 'lavida.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.storage = db;
      //this.loadImagesFromSqlite();
      console.log("opend local database");
      this.dbReady.next(true);
    });
  }
  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getImagesFromSqlite(): Observable<any[]> {
    return this.images.asObservable();
  }

  getAllGlobalCartSetting(){
    let query = 'SELECT * FROM cartt_settings';

    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            variable_name: data.rows.item(i).variable_name,
            variable_value: data.rows.item(i).variable_value
          });
        }
      }
      return result;
    });
  }

  getProductImages() {
   let query = 'SELECT DISTINCT images.name, Product.id FROM images, Product WHERE images.ref_id = Product.id AND images.type = 1 AND Product.web_ready = 1';

    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            name: data.rows.item(i).name,
            productId: data.rows.item(i).id
          });
        }
      }
      return result;
    });
  }

  getCategoryImages() {
   let query = 'SELECT DISTINCT images.name as name FROM images WHERE images.type = 4';

    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            name: data.rows.item(i).name
          });
        }
      }
      return result;
    });
  }
  getLastRegDate(str_query): Promise<any>{
    return this.storage.executeSql(str_query, []).then(res => {
      var  reg_date = '';
      if (res.rows.length > 0) {
        reg_date = res.rows.item(0).reg_date
      }

      return {
        reg_date: reg_date
      }
    });
  }
  getAgentByEmailAndPwd(param): Promise<any> {
    const query = "SELECT * FROM Customer  WHERE email = ? AND password = ? AND is_sales_rep = 1";
    return this.storage.executeSql(query, [param.email, param.password]).then(res => { 
      return {
        id: res.rows.item(0).id,
        group_id: res.rows.item(0).group_id,
        ship_state: res.rows.item(0).ship_state,
        state: res.rows.item(0).state,

        first_name: res.rows.item(0).first_name,
        last_name: res.rows.item(0).last_name,
        email: res.rows.item(0).email,
        phone: res.rows.item(0).phone,
        unit: res.rows.item(0).unit,
        address1: res.rows.item(0).address1,
        address2: res.rows.item(0).address2,
        city: res.rows.item(0).city,
        country: res.rows.item(0).countryname,
        countrykey: res.rows.item(0).countrykey,
        tel_phone: res.rows.item(0).phone,
        mobile_phone: res.rows.item(0).mobile,
        zip: res.rows.item(0).zip,
        password: res.rows.item(0).password,
        post_code: res.rows.item(0).zip,
        position: res.rows.item(0).position,
        fax: res.rows.item(0).fax,
        shop_phone: res.rows.item(0).shop_phone,
        payment_method: res.rows.item(0).payment_method,
        business_structure: res.rows.item(0).business_structure,
        abn: res.rows.item(0).abn,
        comment: res.rows.item(0).comment,
        trading_years: res.rows.item(0).trading_years,
        online_business: res.rows.item(0).online_business,
        domain_name: res.rows.item(0).domain_name,           
      }
    });
  }
  getProfileInfo(param): Promise<any> {
    const query = "SELECT Customer.*, CountryMaster.name as countryname, CountryMaster.id as countrykey FROM Customer LEFT JOIN CountryMaster ON Customer.country = CountryMaster.id WHERE Customer.id = " + param.id;
    return this.storage.executeSql(query, []).then(res => { 
      return {
        id: res.rows.item(0).id,
        first_name: res.rows.item(0).first_name,
        last_name: res.rows.item(0).last_name,
        email: res.rows.item(0).email,
        phone: res.rows.item(0).phone,
        unit: res.rows.item(0).unit,
        address1: res.rows.item(0).address1,
        address2: res.rows.item(0).address2,
        city: res.rows.item(0).city,
        country: res.rows.item(0).countryname,
        countrykey: res.rows.item(0).countrykey,
        tel_phone: res.rows.item(0).phone,
        mobile_phone: res.rows.item(0).mobile,
        state: res.rows.item(0).state,
        zip: res.rows.item(0).zip,
        password: res.rows.item(0).password,
        post_code: res.rows.item(0).zip,
        company: res.rows.item(0).company,
        position: res.rows.item(0).position,
        fax: res.rows.item(0).fax,
        shop_phone: res.rows.item(0).shop_phone,
        payment_method: res.rows.item(0).payment_method,
        business_structure: res.rows.item(0).business_structure,
        abn: res.rows.item(0).abn,
        comment: res.rows.item(0).comment,
        trading_years: res.rows.item(0).trading_years,
        online_business: res.rows.item(0).online_business,
        domain_name: res.rows.item(0).domain_name,
        group_id: res.rows.item(0).group_id,
        ship_state: res.rows.item(0).ship_state,

      }
    });
  }
  updateProfileInfo(update_query){

    return this.storage.executeSql(update_query, [])
    .then(res => {
      console.log("update result====", res);
    }).catch((error: any) =>{
      console.log("update result====", error);
    });
  }
  getMaxId(str_query): Promise<any>{
    return this.storage.executeSql(str_query, []).then(res => {
      var  maxId = 0;
      if (res.rows.length > 0) {
        maxId = res.rows.item(0).maxId
      }

      return {
        maxId: maxId
      }
    });
  }
  getOrderMasterByRegDate(reg_date) {
    let query = "SELECT * FROM OrderMaster WHERE datetime(order_date) > datetime('"+ reg_date + "')";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            order_date: data.rows.item(i).order_date,
            user_id: data.rows.item(i).user_id,
            order_amount: data.rows.item(i).order_amount,
            comments: data.rows.item(i).comments,
            ship_first_name: data.rows.item(i).ship_first_name,
            ship_last_name: data.rows.item(i).ship_last_name,
            ship_email: data.rows.item(i).ship_email,
            ship_address1: data.rows.item(i).ship_address1,
            ship_address2: data.rows.item(i).ship_address2,
            ship_city: data.rows.item(i).ship_city,
            ship_state: data.rows.item(i).ship_state,
            ship_country: data.rows.item(i).ship_country,
            ship_phone: data.rows.item(i).ship_phone,
            ship_zip: data.rows.item(i).ship_zip,
            ship_company: data.rows.item(i).ship_company
          });
        }
      }
      return result;
    });
  }
  getOrderDetailList(reg_date){
    let query = "SELECT * FROM OrderDetails WHERE order_id IN (SELECT id FROM OrderMaster WHERE datetime(order_date) > datetime('"+ reg_date + "'))";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            order_id: data.rows.item(i).order_id,
            product_id: data.rows.item(i).product_id,
            qty: data.rows.item(i).qty,
            price: data.rows.item(i).price,
            product_code: data.rows.item(i).product_code,
            product_name: data.rows.item(i).product_name,
            backorder_qty: data.rows.item(i).backorder_qty,
          });
        }
      }
      return result;
    });

  }

  getSavedOrderMasterByRegDate(reg_date) {
    let query = "SELECT * FROM saveordermaster WHERE datetime(order_date) > datetime('"+ reg_date + "')";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            order_date: data.rows.item(i).order_date,
            user_id: data.rows.item(i).user_id,
            order_amount: data.rows.item(i).order_amount,
            comments: data.rows.item(i).comments,
            ship_first_name: data.rows.item(i).ship_first_name,
            ship_last_name: data.rows.item(i).ship_last_name,
            ship_email: data.rows.item(i).ship_email,
            ship_address1: data.rows.item(i).ship_address1,
            ship_address2: data.rows.item(i).ship_address2,
            ship_city: data.rows.item(i).ship_city,
            ship_state: data.rows.item(i).ship_state,
            ship_country: data.rows.item(i).ship_country,
            ship_phone: data.rows.item(i).ship_phone,
            ship_zip: data.rows.item(i).ship_zip,
            ship_company: data.rows.item(i).ship_company
          });
        }
      }
      return result;
    });
  }
  getSavedOrderDetailList(reg_date){
    let query = "SELECT * FROM saveorderdetails WHERE order_id IN (SELECT id FROM saveordermaster WHERE datetime(order_date) > datetime('"+ reg_date + "'))";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            order_id: data.rows.item(i).order_id,
            product_id: data.rows.item(i).product_id,
            qty: data.rows.item(i).qty,
            price: data.rows.item(i).price,
            product_code: data.rows.item(i).product_code,
            product_name: data.rows.item(i).product_name,
            backorder_qty: data.rows.item(i).backorder_qty,

          });
        }
      }
      return result;
    });

  }
  addToSqlite(insert_query, data){
    return this.storage.executeSql(insert_query, data)
    .then(res => {
      console.log("insert result====", res);
      return res.insertId;
    }); 
  }
  //Delete
  delete(query) {
    return this.storage.executeSql(query)
    .then(res => {
      console.log("delete result====", res);
    }).catch((error: any) =>{
      console.log("delete result====", error);
    });
  }
  
  getCustomersByAgent(query) {

    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            customer_id: data.rows.item(i).user_id
          });
        }
      }
      //this.images.next(result);
      return result;
    });
  }

  getProductImagesById(productId){
    let query = "SELECT * FROM images WHERE type = 1 AND ref_id = " + productId;
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            name: data.rows.item(i).name
          });
        }
      }
      return result;
    });
  }

  getCategoryImagesById(categoryId){
    let query = "SELECT * FROM images WHERE type = 4 AND ref_id = " + categoryId;
    return this.storage.executeSql(query, []).then(data => {
      let result = {};
      if (data.rows.length > 0) {
          result = { 
            name: data.rows.item(0).name
          }
      }
      return result;
    });
  }  
  getProdCatId(productId){
    let query = "SELECT ProdCat.id FROM ProdCat, ProductCategory WHERE ProdCat.id = ProductCategory.category_id AND ProductCategory.product_id = " +  productId + " AND ProductCategory.category_id > 0 AND ProdCat.portal1 = 1 ORDER BY ProdCat.display_order asc, ProdCat.name asc";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push(data.rows.item(i).id);
        }
      }
      return result;
    });
  }  

  getDataForRibbon(productId){
    let query = "SELECT DISTINCT `Product`.`id` AS `dis_id`, `Product`.* FROM `Product`, `ProdCat`, `ProductCategory` WHERE `ProductCategory`.`product_id` = `Product`.`id` AND `ProductCategory`.`category_id` = `ProdCat`.`id` AND `Product`.`id` = " + productId;
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            group2_special_price: data.rows.item(i).group2_special_price,
            group2_special_discount: data.rows.item(i).group2_special_discount,
            new_product: data.rows.item(i).new_product,
            pre_order: data.rows.item(i).pre_order,
          
          });        }
      }
      return result;
    });
  }   
  //Home page start---------
  getHomeSlider(){
    let query = "SELECT * FROM images WHERE type = 14 AND ref_id = 1 AND curr_page='index'";
    
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            title: data.rows.item(i).title,
            description: data.rows.item(i).description,
            name: data.rows.item(i).name
          });
        }
      }
      return result;
    });
  }

  //Category page start-----
  getCategories(from, searchText){
    // let query = "SELECT DISTINCT a.* FROM ProdCat as a LEFT JOIN ProductCategory as b ON a.id = b.category_id LEFT JOIN Product as c ON b.product_id = c.id WHERE a.type = 1 AND a.portal1 = 1 AND a.image != 'NULL' ORDER BY a.name, a.display_order LIMIT " + from + ", 6";
    const searchParam = searchText == '' ? '' : " ProdCat.name LIKE '%" + searchText + "%' AND";  

    let query = "select * from ProdCat where" +  searchParam + " hide_home !=1 and type='1' and portal1='1' and hide_nav='0' order by display_title, display_order LIMIT " + from + ", 10";
    console.log(query);
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name
          });
        }
      }
      return result;
    });
  }
  async getProductsInOrderDetail(orderId){

    let query = "SELECT Product.*, Product.id as dis_id, saveorderdetails.qty as detailorder_qty, saveorderdetails.price as detailorder_price FROM Product LEFT JOIN saveorderdetails ON Product.id = saveorderdetails.product_id WHERE saveorderdetails.order_id = " + orderId;
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            productId: data.rows.item(i).dis_id,
            productPrice: data.rows.item(i).detailorder_price,
            productName: data.rows.item(i).name,
            productDimension: data.rows.item(i).dimension,
            productBarCode: data.rows.item(i).barcode,
            productMaterials: data.rows.item(i).materials,
            productMinQty: data.rows.item(i).minimum_qty,
            productCode: data.rows.item(i).code,
            productImportantInfo: data.rows.item(i).important_information,
            productDescription: data.rows.item(i).description,
            productShortDescription: data.rows.item(i).short_description,
            productQtySlab: data.rows.item(i).qty_slab1,
            productPriceSlab: data.rows.item(i).price_slab1,
            qty: data.rows.item(i).detailorder_qty,
            remainQty: data.rows.item(i).quantity
          });
        }
      }
      return result;
    });
  }  
  async getProductsInOrderMasterDetail(orderId){

    let query = "SELECT Product.*, Product.id as dis_id, OrderDetails.qty as detailorder_qty, OrderDetails.price as detailorder_price FROM Product LEFT JOIN OrderDetails ON Product.id = OrderDetails.product_id WHERE OrderDetails.order_id = " + orderId;
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            productId: data.rows.item(i).dis_id,
            productPrice: data.rows.item(i).detailorder_price,
            productName: data.rows.item(i).name,
            productDimension: data.rows.item(i).dimension,
            productBarCode: data.rows.item(i).barcode,
            productMaterials: data.rows.item(i).materials,
            productMinQty: data.rows.item(i).minimum_qty,
            productCode: data.rows.item(i).code,
            productImportantInfo: data.rows.item(i).important_information,
            productDescription: data.rows.item(i).description,
            productShortDescription: data.rows.item(i).short_description,
            productQtySlab: data.rows.item(i).qty_slab1,
            productPriceSlab: data.rows.item(i).price_slab1,
            qty: data.rows.item(i).detailorder_qty,
            remainQty: data.rows.item(i).quantity
          });
        }
      }
      return result;
    });
  }    
  //Product page start------
  getProducts(categoryId, group_id, from){
    let query = "SELECT DISTINCT Product.id AS productId, Product.group" + group_id + "_price as productPrice,  Product.* FROM Product, ProdCat, ProductCategory WHERE ProductCategory.product_id = Product.id AND ProductCategory.category_id = ProdCat.id AND Product.parent_id <= 0 AND Product.web_ready = '1' AND ProductCategory.category_id = " +  categoryId + " AND Product.group2_price > 0 ORDER BY datetime(due_date) DESC, new_product DESC, datetime(new_date) DESC, id DESC, code LIMIT " + from + ", 15";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            productId: data.rows.item(i).productId,
            productPrice: data.rows.item(i).productPrice,
            productName: data.rows.item(i).name,
            productDimension: data.rows.item(i).dimension,
            productBarCode: data.rows.item(i).barcode,
            productMaterials: data.rows.item(i).materials,
            productMinQty: data.rows.item(i).minimum_qty,
            productCartonQty: data.rows.item(i).FT_CARTON_QTY,
            productWeight: data.rows.item(i).FT_WEIGHT,
            productLength: data.rows.item(i).FT_LENGTH,
            productWidth: data.rows.item(i).FT_WIDTH,
            productHeight: data.rows.item(i).FT_HEIGHT,
            productCode: data.rows.item(i).code,
            productImportantInfo: data.rows.item(i).important_information,
            productDescription: data.rows.item(i).description,
            productShortDescription: data.rows.item(i).short_description,
            productQtySlab: data.rows.item(i).qty_slab1,
            productPriceSlab: data.rows.item(i).price_slab1,
            productPreOrder: data.rows.item(i).pre_order,
            remainQty: data.rows.item(i).quantity
          });
        }
      }
      return result;
    });
  }
  async getNewProducts(group_id, from, searchText){
    const searchParam = searchText == '' ? '' : " Product.name LIKE '%" + searchText + "%' AND";  
    let query = "SELECT DISTINCT `Product`.`id` AS `dis_id`, `Product`.*, Product.group" + group_id + "_price as productPrice FROM `Product`, `ProdCat`,`ProductCategory` WHERE" +  searchParam + " `ProductCategory`.`product_id` = `Product`.`id` AND `ProductCategory`.`category_id` = `ProdCat`.`id` AND Product.web_ready='1' AND Product.parent_id <= '0' AND ProdCat.portal1='1' AND  Product.new_product=1 ORDER BY datetime(Product.new_date) DESC, Product.new_product DESC, Product.id DESC, code LIMIT " + from + ", 15";
    
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            productId: data.rows.item(i).dis_id,
            productPrice: data.rows.item(i).productPrice,
            productName: data.rows.item(i).name,
            productDimension: data.rows.item(i).dimension,
            productBarCode: data.rows.item(i).barcode,
            productMaterials: data.rows.item(i).materials,
            productMinQty: data.rows.item(i).minimum_qty,
            productCartonQty: data.rows.item(i).FT_CARTON_QTY,
            productWeight: data.rows.item(i).FT_WEIGHT,
            productLength: data.rows.item(i).FT_LENGTH,
            productWidth: data.rows.item(i).FT_WIDTH,
            productHeight: data.rows.item(i).FT_HEIGHT,
            productCode: data.rows.item(i).code,
            productImportantInfo: data.rows.item(i).important_information,
            productDescription: data.rows.item(i).description,
            productShortDescription: data.rows.item(i).short_description,
            productQtySlab: data.rows.item(i).qty_slab1,
            productPriceSlab: data.rows.item(i).price_slab1,
            productPreOrder: data.rows.item(i).pre_order,
            remainQty: data.rows.item(i).quantity
          });
        }
      }
      return result;
    });
  }
  async getClearanceProducts(group_id, from){

    let query = "SELECT DISTINCT `Product`.`id` AS `dis_id`, `Product`.*, Product.group" + group_id + "_price as productPrice FROM `Product`, `ProdCat`, `ProductCategory` WHERE `ProductCategory`.`product_id` = `Product`.`id` AND `ProductCategory`.`category_id` = `ProdCat`.`id` AND Product.parent_id <= 0 AND Product.web_ready = '1' AND ProductCategory.category_id = 47 AND Product.group2_price > 0 ORDER BY datetime(due_date) DESC, new_product desc, datetime(new_date) DESC, id desc, code limit " + from + ", 30";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            productId: data.rows.item(i).dis_id,
            productPrice: data.rows.item(i).productPrice,
            productName: data.rows.item(i).name,
            productDimension: data.rows.item(i).dimension,
            productBarCode: data.rows.item(i).barcode,
            productMaterials: data.rows.item(i).materials,
            productMinQty: data.rows.item(i).minimum_qty,
            productCode: data.rows.item(i).code,
            productImportantInfo: data.rows.item(i).important_information,
            productDescription: data.rows.item(i).description,
            productShortDescription: data.rows.item(i).short_description,
            productQtySlab: data.rows.item(i).qty_slab1,
            productPriceSlab: data.rows.item(i).price_slab1,
            remainQty: data.rows.item(i).quantity,
            productCartonQty: data.rows.item(i).FT_CARTON_QTY,
            productWeight: data.rows.item(i).FT_WEIGHT,
            productLength: data.rows.item(i).FT_LENGTH,
            productWidth: data.rows.item(i).FT_WIDTH,
            productHeight: data.rows.item(i).FT_HEIGHT,

          });
        }
      }
      return result;
    });
  }  
  async getSpecialProducts(group_id, from){

    let query = "SELECT DISTINCT `Product`.`id` AS `dis_id`, `Product`.*, Product.group" + group_id + "_price as productPrice FROM `Product`, `ProdCat`, `ProductCategory` WHERE `ProductCategory`.`product_id` = `Product`.`id` AND `ProductCategory`.`category_id` = `ProdCat`.`id` AND Product.web_ready='1' AND Product.parent_id <= '0' AND ProdCat.portal1='1' AND (Product.group" + group_id + "_special_price > 0 || Product.group"+ group_id +"_special_discount > 0) AND ProdCat.id!='47' ORDER BY datetime(due_date) DESC, new_product DESC, datetime(new_date) DESC, id DESC, code LIMIT " + from + ", 30";
    return this.storage.executeSql(query, []).then(data => {
      let result = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          result.push({ 
            productId: data.rows.item(i).dis_id,
            productPrice: data.rows.item(i).productPrice,
            productName: data.rows.item(i).name,
            productDimension: data.rows.item(i).dimension,
            productBarCode: data.rows.item(i).barcode,
            productMaterials: data.rows.item(i).materials,
            productMinQty: data.rows.item(i).minimum_qty,
            productCode: data.rows.item(i).code,
            productImportantInfo: data.rows.item(i).important_information,
            productDescription: data.rows.item(i).description,
            productShortDescription: data.rows.item(i).short_description,
            productQtySlab: data.rows.item(i).qty_slab1,
            productPriceSlab: data.rows.item(i).price_slab1,
            productCartonQty: data.rows.item(i).FT_CARTON_QTY,
            productWeight: data.rows.item(i).FT_WEIGHT,
            productLength: data.rows.item(i).FT_LENGTH,
            productWidth: data.rows.item(i).FT_WIDTH,
            productHeight: data.rows.item(i).FT_HEIGHT,


          });
        }
      }
      return result;
    });
  }    
  //Customer page start----
  getCustomers(parentId, from){
    let query = "SELECT * FROM Customer WHERE status = 2 AND parent_id = " + parentId + " ORDER BY company ASC LIMIT " + from +  ", 30";
    return this.storage.executeSql(query, []).then(res => {
      let result = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          result.push({ 
            customerId: res.rows.item(i).id,
            customerParentId: res.rows.item(i).parent_id,
            company: res.rows.item(i).company,
            group_id: res.rows.item(0).group_id,
            ship_state: res.rows.item(0).ship_state,
            id: res.rows.item(0).id,
            first_name: res.rows.item(0).first_name,
            last_name: res.rows.item(0).last_name,
            email: res.rows.item(0).email,
            phone: res.rows.item(0).phone,
            unit: res.rows.item(0).unit,
            address1: res.rows.item(0).address1,
            address2: res.rows.item(0).address2,
            city: res.rows.item(0).city,
            country: res.rows.item(0).countryname,
            countrykey: res.rows.item(0).countrykey,
            tel_phone: res.rows.item(0).phone,
            mobile_phone: res.rows.item(0).mobile,
            state: res.rows.item(0).state,
            zip: res.rows.item(0).zip,
            password: res.rows.item(0).password,
            post_code: res.rows.item(0).zip,
            position: res.rows.item(0).position,
            fax: res.rows.item(0).fax,
            shop_phone: res.rows.item(0).shop_phone,
            payment_method: res.rows.item(0).payment_method,
            business_structure: res.rows.item(0).business_structure,
            abn: res.rows.item(0).abn,
            comment: res.rows.item(0).comment,
            trading_years: res.rows.item(0).trading_years,
            online_business: res.rows.item(0).online_business,
            domain_name: res.rows.item(0).domain_name,            
          });
        }
      }
      return result;
    });
  }

  //Order page start-----------
  getCheckoutOrders(userId, from){
      let query = "SELECT * FROM OrderMaster WHERE user_id = " + userId + " AND date(order_date) > date('now','-1 years') ORDER BY order_date DESC LIMIT " + from +  ", 30";
      console.log(query);
      return this.storage.executeSql(query, []).then(data => {
        let result = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            result.push({ 
              orderDate: data.rows.item(i).order_date,
              orderId: data.rows.item(i).id,
              status: data.rows.item(i).status,
              userId: data.rows.item(i).user_id
            });
          }
        }
        return result;
      });
    }
    loadCheckoutOrderDetails(orderId){
      let query = "SELECT * FROM OrderDetails WHERE order_id = " + orderId ;
      return this.storage.executeSql(query, []).then(data => {
        let result = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            result.push({ 
              orderId: data.rows.item(i).order_id,
              productId: data.rows.item(i).product_id,
              productCode: data.rows.item(i).product_code,
              productQty: data.rows.item(i).qty,
              productPrice: data.rows.item(i).price,
              productName: data.rows.item(i).product_name,
              id: data.rows.item(i).id
            });
          }
        }
        return result;
      });
    }      
    loadSavedOrders(userId, from){
      let query = "SELECT * FROM saveordermaster WHERE user_id = " + userId + " AND date(order_date) >= date('now','-1 years') ORDER BY datetime(order_date) DESC LIMIT " + from +  ", 30";
      return this.storage.executeSql(query, []).then(data => {
        let result = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            result.push({ 
              orderDate: data.rows.item(i).order_date,
              orderId: data.rows.item(i).id,
              userId: data.rows.item(i).user_id
            });
          }
        }
        return result;
      });
    }   
    loadSavedOrderDetails(orderId){
      let query = "SELECT * FROM saveorderdetails WHERE order_id = " + orderId ;
      return this.storage.executeSql(query, []).then(data => {
        let result = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            result.push({ 
              orderId: data.rows.item(i).order_id,
              productId: data.rows.item(i).product_id,
              productCode: data.rows.item(i).product_code,
              productQty: data.rows.item(i).qty,
              productPrice: data.rows.item(i).price,
              productName: data.rows.item(i).product_name,
              id: data.rows.item(i).id
            });
          }
        }
        return result;
      });
    }       
}

