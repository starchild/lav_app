import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupFirstPageRoutingModule } from './signup-first-routing.module';

import { SignupFirstPage } from './signup-first.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupFirstPageRoutingModule
  ],
  declarations: [SignupFirstPage]
})
export class SignupFirstPageModule {}
