import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedordersPage } from './savedorders.page';

const routes: Routes = [
  {
    path: '',
    component: SavedordersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedordersPageRoutingModule {}
