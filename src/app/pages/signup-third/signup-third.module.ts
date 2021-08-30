import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SignupThirdPageRoutingModule } from './signup-third-routing.module';

import { SignupThirdPage } from './signup-third.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SignupThirdPageRoutingModule
  ],
  declarations: [SignupThirdPage]
})
export class SignupThirdPageModule {}
