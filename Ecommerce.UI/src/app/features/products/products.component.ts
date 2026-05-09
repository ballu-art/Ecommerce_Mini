import { Component, HostListener, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, combineLatestWith } from 'rxjs/operators';
import { APP_CONSTANTS } from '../../config/constants';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, OnDestroy {
  categories = APP_CONSTANTS.CATEGORIES;
  selectedCategory = 'all';
  sortBy = 'featured';
  searchTerm = '';
  selectedProductForQuote: Product | null = null;
  showWhatsappModal = false;
  isAdmin = false;
  
  // All products loaded from service
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  itemsPerPage = 20;
  isLoadingMore = false;
  cartSuccessMessage = '';
  
  // Observable subjects for reactive filtering
  private selectedCategorySubject = new BehaviorSubject<string>('all');
  private sortBySubject = new BehaviorSubject<string>('featured');
  private searchTermSubject = new BehaviorSubject<string>('');
  
  // Cached filtered results
  private cachedFilteredProducts: Product[] = [];
  private cachedFilteredCount = 0;
  private lastFilterConfig = { category: 'all', sort: 'featured', search: '' };

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private seoService: SeoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.checkAdminStatus();
  }

  ngOnInit() {
    this.seoService.setProductsPage();
    
    // Check for category in URL params
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['category']) {
          const urlSlug = params['category'];
          const matchedCategory = this.categories.find(cat =>
            cat.slug.toLowerCase() === urlSlug.toLowerCase()
          );
          
          if (matchedCategory) {
            this.selectedCategory = matchedCategory.slug;
            this.selectedCategorySubject.next(matchedCategory.slug);
          } else {
            this.selectedCategory = 'all';
            this.selectedCategorySubject.next('all');
          }
        } else {
          this.selectedCategory = 'all';
          this.selectedCategorySubject.next('all');
        }
      });
    
    this.loadProductsFromService();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProductsFromService() {
    // Subscribe to product updates from service (includes admin changes)
    this.productService.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.allProducts = products;
        this.displayedProducts = [];
        this.cachedFilteredProducts = []; // Clear cache
        this.lastFilterConfig = { category: '', sort: '', search: '' }; // Force recalculation
        
        // Load initial products synchronously
        this.loadInitialProducts();
      });
  }

  /**
   * Load initial products synchronously on first load
   */
  loadInitialProducts() {
    if (!this.allProducts.length) return;
    
    const endIdx = Math.min(this.itemsPerPage, this.allProducts.length);
    this.displayedProducts = [...this.allProducts.slice(0, endIdx)];
    this.cdr.markForCheck();
  }
  /**
   * Get filtered and sorted products (cached for performance)
   * Only recalculates when filter parameters change
   */
  getFilteredProducts(): Product[] {
    const currentConfig = {
      category: this.selectedCategory,
      sort: this.sortBy,
      search: this.searchTerm
    };
    
    // Return cached results if config hasn't changed
    if (JSON.stringify(currentConfig) === JSON.stringify(this.lastFilterConfig)) {
      return this.cachedFilteredProducts;
    }
    
    // Update cache config
    this.lastFilterConfig = { ...currentConfig };
    
    let filtered = this.displayedProducts;

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (this.sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (this.sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (this.sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    // Cache the result
    this.cachedFilteredProducts = filtered;
    return filtered;
  }

  loadMoreProducts() {
    if (this.isLoadingMore || !this.allProducts.length) return;
    
    this.isLoadingMore = true;
    
    // Use async only for lazy loading additional products (not initial load)
    requestAnimationFrame(() => {
      setTimeout(() => {
        const startIdx = this.displayedProducts.length;
        const endIdx = Math.min(startIdx + this.itemsPerPage, this.allProducts.length);
        
        // Add new products in batch
        if (startIdx < this.allProducts.length) {
          this.displayedProducts.push(...this.allProducts.slice(startIdx, endIdx));
          this.cachedFilteredProducts = []; // Clear cache to force recalculation
          this.cdr.markForCheck();
        }
        
        this.isLoadingMore = false;
      }, 100);
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.selectedCategorySubject.next(category);
    // Clear cache to force re-filtering
    this.cachedFilteredProducts = [];
    this.lastFilterConfig = { category: '', sort: '', search: '' }; // Force recalculation
    this.cdr.markForCheck();
  }

  onSortChange() {
    this.sortBySubject.next(this.sortBy);
    this.cachedFilteredProducts = [];
    this.cdr.markForCheck();
  }

  onSearchChange() {
    this.searchTermSubject.next(this.searchTerm);
    this.cachedFilteredProducts = [];
  }
  /**
   * Get count of filtered products (cached)
   */
  getFilteredCount(): number {
    return this.getFilteredProducts().length;
  }

  /**
   * TrackBy function for *ngFor performance
   * Prevents unnecessary DOM rerendering
   */
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    // Throttle scroll event - only check every 300ms
    if (this.isLoadingMore) return;
    
    const scrollPosition = (window.innerHeight + window.scrollY);
    const pageHeight = document.documentElement.scrollHeight;
    
    const filteredCount = this.getFilteredCount();
    if (scrollPosition >= pageHeight - 500 && !this.isLoadingMore && this.displayedProducts.length < filteredCount) {
      this.loadMoreProducts();
    }
  }

  openWhatsApp(product: Product) {
    // Create professionally formatted message with classic design
    const whatsappMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         PRODUCT INQUIRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*${product.name}*

*Category:* ${product.category}
*Rating:* ${product.rating || 'N/A'} ⭐

*Description:*
${product.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hello! I'm interested in this product.

Can you please provide me with:
• Detailed specifications
• Bulk pricing options
• Delivery timeframe
• Payment terms
• Technical support information

Thank you for your time!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${APP_CONSTANTS.WHATSAPP_PHONE_NUMBER}&text=${encodeURIComponent(whatsappMessage.trim())}`;
    window.open(whatsappUrl, '_blank');
  }

  openWhatsAppModal(product: Product) {
    this.selectedProductForQuote = product;
    this.showWhatsappModal = true;
  }

  closeWhatsappModal() {
    this.showWhatsappModal = false;
    this.selectedProductForQuote = null;
  }

  confirmWhatsApp() {
    if (this.selectedProductForQuote) {
      this.openWhatsApp(this.selectedProductForQuote);
      this.closeWhatsappModal();
    }
  }

  toggleLike(product: Product, event: Event) {
    event.stopPropagation();
    product.liked = !product.liked;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product as any, 1);
    this.cartSuccessMessage = `${product.name} added to cart!`;
    setTimeout(() => {
      this.cartSuccessMessage = '';
    }, 2000);
  }

  /**
   * Check if current user is admin
   */
  private checkAdminStatus(): void {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.isAdmin = userData.isAdmin || false;
      } catch (error) {
        this.isAdmin = false;
      }
    }
  }

  getBadgeClass(badge: string | null | undefined): string {
    if (!badge) return '';
    return `badge-${badge.toLowerCase().replace(/\s+/g, '-')}`;
  }

  hasBadge(badge: string | null | undefined): boolean {
    return !!badge;
  }

  /**
   * Convert category name to URL slug from CATEGORIES constant
   */
  getCategorySlug(category: string): string {
    if (!category) return '';
    
    // Find the matching category from the constants
    const matchedCategory = this.categories.find(cat => 
      cat.name.toLowerCase() === category.toLowerCase()
    );
    
    return matchedCategory?.slug || category.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');
  }
}

