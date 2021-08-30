import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LoginPageModule } from './pages/login/login.module';
import { CartSettingService } from './services/global-carttsetting/cart-setting.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LoginPageModule,
    FontAwesomeModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SQLitePorter,
    SqliteDbCopy,
    CartSettingService,
    InAppBrowser,
    WebView,
    File,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) { 
		library.addIconPacks(fas, fab, far);
	}
}
