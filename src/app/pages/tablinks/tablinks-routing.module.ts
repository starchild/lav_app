import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablinksPage } from './tablinks.page';

const routes: Routes = [
  {
    path: '',
    component: TablinksPage,

    children: [
      { path: '', redirectTo: 'category', pathMatch: 'full' },

      {
        path: 'category',
        loadChildren: () => import('../../pages/category/category.module').then( m => m.CategoryPageModule)
      },
      {
        path: 'order',
        loadChildren: () => import('../../pages/order/order.module').then( m => m.OrderPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../pages/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('../../pages/customer/customer.module').then( m => m.CustomerPageModule)
      }
      ,
      {
        path: 'customer',
        loadChildren: () => import('../../pages/customer/customer.module').then( m => m.CustomerPageModule)
      },
      {
        path: 'product/:id',
        loadChildren: () => import('../../pages/product/product.module').then( m => m.ProductPageModule)
      }
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablinksPageRoutingModule {}
