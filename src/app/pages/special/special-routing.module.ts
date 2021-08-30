import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialPage } from './special.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialPageRoutingModule {}
