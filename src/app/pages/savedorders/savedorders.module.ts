import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedordersPageRoutingModule } from './savedorders-routing.module';

import { SavedordersPage } from './savedorders.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SavedordersPageRoutingModule
  ],
  declarations: [SavedordersPage]
})
export class SavedordersPageModule {}
