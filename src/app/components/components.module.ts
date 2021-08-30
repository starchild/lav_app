import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoadingComponent } from './loading/loading.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { ExpandableComponent } from './expandable/expandable.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LoadingComponent,
    AppHeaderComponent,
    ExpandableComponent
  ],
  exports: [
    LoadingComponent,
    AppHeaderComponent,
    ExpandableComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
