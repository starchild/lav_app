import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupThirdPage } from './signup-third.page';

const routes: Routes = [
  {
    path: '',
    component: SignupThirdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupThirdPageRoutingModule {}
