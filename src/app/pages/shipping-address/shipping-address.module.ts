import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ShippingAddressPageRoutingModule } from './shipping-address-routing.module';

import { ShippingAddressPage } from './shipping-address.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    IonicModule,
    ShippingAddressPageRoutingModule
  ],
  declarations: [ShippingAddressPage]
})
export class ShippingAddressPageModule {}
