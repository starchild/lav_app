import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PaymentPageRoutingModule
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}
