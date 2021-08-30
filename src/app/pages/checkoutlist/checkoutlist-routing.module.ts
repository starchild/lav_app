import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutlistPage } from './checkoutlist.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutlistPageRoutingModule {}
