import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfilePage } from './profile.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
