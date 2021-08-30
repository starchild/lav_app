import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupSecondPage } from './signup-second.page';

const routes: Routes = [
  {
    path: '',
    component: SignupSecondPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupSecondPageRoutingModule {}
