import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupFirstPage } from './signup-first.page';

const routes: Routes = [
  {
    path: '',
    component: SignupFirstPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupFirstPageRoutingModule {}
