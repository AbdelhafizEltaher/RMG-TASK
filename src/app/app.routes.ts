import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
      {
        path: 'products',
        children: [
          { path: '', loadComponent: () => import('./features/products/product-list/product-list.component').then((m) => m.ProductListComponent) },
          { path: 'new', loadComponent: () => import('./features/products/product-new/product-new.component').then((m) => m.ProductNewComponent) },
          { path: ':id/edit', loadComponent: () => import('./features/products/product-edit/product-edit.component').then((m) => m.ProductEditComponent) },
          { path: ':id', loadComponent: () => import('./features/products/product-detail/product-detail.component').then((m) => m.ProductDetailComponent) }
        ]
      },
      {
        path: 'invoices',
        children: [
          { path: '', loadComponent: () => import('./features/invoices/invoice-list/invoice-list.component').then((m) => m.InvoiceListComponent) },
          { path: 'new', loadComponent: () => import('./features/invoices/invoice-create/invoice-create.component').then((m) => m.InvoiceCreateComponent) },
          { path: ':id', loadComponent: () => import('./features/invoices/invoice-detail/invoice-detail.component').then((m) => m.InvoiceDetailComponent) }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'home' }
];
