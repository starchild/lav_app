import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Signup4Page } from './signup4.page';

const routes: Routes = [
  {
    path: '',
    component: Signup4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Signup4PageRoutingModule {}
