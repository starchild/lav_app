import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  MenuController,  } from '@ionic/angular';
import {StorageService} from '../../services/storage/storage.service';
import { Router} from '@angular/router';

import { LoginPage } from '../../pages/login/login.page';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {

  @Input() pageTitle: string;
  @Input() isLoggedIn: boolean;
  @Input() cartBadgeCount: any;
  @Input() showSearchBar: any;
  @Output() searcnInput = new EventEmitter<any>();
  constructor(
    public menuCtrl: MenuController,
    public storageService: StorageService,
    public router: Router,

  ) { }

  ngOnInit() {}

  async openLoginModal() {
    this.router.navigate(['/login']);
  }

  gotoCart(){
    this.router.navigate(['/cart']);
  }

  gotoCategory(){
    this.router.navigate(['/category']);
  }
  
  logout(){
    this.storageService.removeItem("loginedUser");
    this.menuCtrl.close('loggedin_customMenu');
    this.isLoggedIn = false;
  }

  async openMenu() {
    if(this.isLoggedIn){
      this.menuCtrl.enable(true, 'loggedin_customMenu');
      this.menuCtrl.open('loggedin_customMenu');
      
    }else{
      this.menuCtrl.enable(true, 'customMenu');
      this.menuCtrl.open('customMenu');
  
    }
  }

  onChangeSearchInput(e){
    this.searcnInput.emit(e.detail.value);
  }
}
