import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}
