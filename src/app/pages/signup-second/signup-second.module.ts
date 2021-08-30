import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SignupSecondPageRoutingModule } from './signup-second-routing.module';

import { SignupSecondPage } from './signup-second.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupSecondPageRoutingModule
  ],
  declarations: [SignupSecondPage]
})
export class SignupSecondPageModule {}
