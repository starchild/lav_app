import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClearancePageRoutingModule } from './clearance-routing.module';

import { ClearancePage } from './clearance.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ClearancePageRoutingModule
  ],
  declarations: [ClearancePage]
})
export class ClearancePageModule {}
