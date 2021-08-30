import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewArrivalPageRoutingModule } from './new-arrival-routing.module';

import { NewArrivalPage } from './new-arrival.page';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NewArrivalPageRoutingModule
  ],
  declarations: [NewArrivalPage]
})
export class NewArrivalPageModule {}
