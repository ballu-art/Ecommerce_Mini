import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-local-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Local Hero Section -->
      <section class="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Premium Construction Chemicals in {{ locationName }}
            </h1>
            <p class="text-xl mb-2 opacity-95">
              Local Supply | Same-Day Delivery | Expert Support
            </p>
            <p class="text-lg mb-8 opacity-90">
              Trusted by 1000+ contractors and builders in {{ regionName }}
            </p>
            <div class="flex flex-wrap gap-4 justify-center">
              <button routerLink="/products" class="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
                🛒 Browse Products
              </button>
              <button routerLink="/contact" class="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
                📞 Get Local Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Location Info -->
      <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-slate-900 mb-12 text-center">Why Choose ballu art in {{ locationName }}?</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div class="text-4xl mb-4">📍</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Local Location</h3>
              <p class="text-slate-700">Based in {{ locationName }}, serving your area with local expertise and quick support.</p>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div class="text-4xl mb-4">🚚</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Same-Day Delivery</h3>
              <p class="text-slate-700">Quick turnaround for orders placed before 2 PM on working days within {{ locationName }}.</p>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div class="text-4xl mb-4">⭐</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">98% Satisfaction</h3>
              <p class="text-slate-700">1000+ happy customers across {{ regionName }} trust us for quality and reliability.</p>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div class="text-4xl mb-4">✓</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Certified Quality</h3>
              <p class="text-slate-700">ISO 9001:2015 certified products meeting international standards.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Section -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-slate-900 mb-12 text-center">Our Products Available in {{ locationName }}</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div *ngFor="let category of productCategories" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div class="text-4xl mb-4">{{ category.icon }}</div>
              <h3 class="text-2xl font-bold text-slate-900 mb-3">{{ category.name }}</h3>
              <p class="text-slate-700 mb-6">{{ category.description }}</p>
              <ul class="space-y-2 mb-6">
                <li *ngFor="let item of category.items" class="flex items-center gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-slate-700">{{ item }}</span>
                </li>
              </ul>
              <button [routerLink]="['/products', category.slug]" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all">
                Browse {{ category.name }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Service Area Info -->
      <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-slate-900 mb-12 text-center">Our Service Area</h2>
          
          <div class="bg-white rounded-lg p-8 border-2 border-blue-200">
            <p class="text-lg text-slate-700 mb-6">
              We provide same-day delivery and fast shipping to {{ locationName }} and nearby areas including:
            </p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div *ngFor="let area of serviceAreas" class="bg-blue-50 p-4 rounded-lg text-center text-slate-700 font-medium border border-blue-200">
                📍 {{ area }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Order from {{ locationName }}?</h2>
          <p class="text-lg mb-8 opacity-90">
            Get premium construction chemicals delivered right to your doorstep with expert support.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <button routerLink="/products" class="bg-slate-900 hover:bg-black text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105">
              🛒 Shop Now - 15% OFF
            </button>
            <button routerLink="/contact" class="bg-white hover:bg-gray-100 text-slate-900 font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105">
              📞 Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class LocalLandingComponent implements OnInit, OnDestroy {
  locationName = 'Surendranagar';
  regionName = 'Gujarat';
  serviceAreas: string[] = [];
  productCategories = [
    {
      name: 'Tile Adhesives',
      icon: '🏗️',
      slug: 'tile-adhesives',
      description: 'Premium universal and rapid-set tile adhesives for ceramic, porcelain, and stone tiles',
      items: ['Universal Tile Adhesive', 'Rapid Set Formula', 'Premium Grade', 'Cost Effective']
    },
    {
      name: 'Waterproofing Solutions',
      icon: '💧',
      slug: 'waterproofing-solutions',
      description: 'Advanced waterproofing membranes and coatings for concrete and masonry',
      items: ['Liquid Membrane', 'Powder Coating', 'Polymeric Solution', 'Long-Lasting']
    },
    {
      name: 'White Cement',
      icon: '⚪',
      slug: 'white-cement',
      description: 'Premium white cement for aesthetic finishing and specialized applications',
      items: ['Premium Grade', 'Fine Finish', 'Durable', 'Waterproof']
    },
    {
      name: 'Bonding Agents',
      icon: '🔗',
      slug: 'bonding-agents-additives',
      description: 'Industrial bonding and adhesive solutions for various construction needs',
      items: ['Strong Bond', 'Quick Setting', 'Flexible', 'Heat Resistant']
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(private seoService: SeoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get location from route params
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.updateLocationData(params['location']);
      });

    // Update SEO
    this.seoService.setProductsPage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateLocationData(location: string): void {
    const locationMap: { [key: string]: { name: string; region: string; areas: string[] } } = {
      'surendranagar': {
        name: 'Surendranagar',
        region: 'Gujarat',
        areas: ['Surendranagar', 'Lilapur', 'Chotila', 'Muli', 'Dhrol']
      },
      'rajkot': {
        name: 'Rajkot',
        region: 'Gujarat',
        areas: ['Rajkot', 'Morvi', 'Wankaner', 'Jetpur', 'Gondal']
      },
      'ahmedabad': {
        name: 'Ahmedabad',
        region: 'Gujarat',
        areas: ['Ahmedabad', 'Vadodara', 'Anand', 'Kheda', 'Gandhinagar']
      }
    };

    const data = locationMap[location?.toLowerCase()] || locationMap['surendranagar'];
    this.locationName = data.name;
    this.regionName = data.region;
    this.serviceAreas = data.areas;
  }
}
