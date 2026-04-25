import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { AdminProductsComponent } from './features/admin/admin-products.component';
import { LoginComponent } from './features/auth/login.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LocalLandingComponent } from './features/local-landing/local-landing.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:category', component: ProductsComponent },  // Category filter
  { path: 'products/:category/:slug', component: ProductDetailComponent }, // Product by slug with category
  { path: 'product/:id', component: ProductDetailComponent },  // Legacy fallback for ID-based URLs
  
  // LOCAL SEO - Location-based landing pages
  { path: 'construction-chemicals-surendranagar', component: LocalLandingComponent, data: { location: 'surendranagar' } },
  { path: 'construction-chemicals-rajkot', component: LocalLandingComponent, data: { location: 'rajkot' } },
  { path: 'construction-chemicals-ahmedabad', component: LocalLandingComponent, data: { location: 'ahmedabad' } },
  { path: 'local/:location', component: LocalLandingComponent },
  
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin/products', component: AdminProductsComponent },
  { path: '**', redirectTo: '' }
];

