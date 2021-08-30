import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewArrivalPage } from './new-arrival.page';

const routes: Routes = [
  {
    path: '',
    component: NewArrivalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewArrivalPageRoutingModule {}
