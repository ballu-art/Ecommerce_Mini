import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

/**
 * SEO Optimization Service
 * Manages page titles, meta descriptions, and structured data
 * Centralizes SEO metadata management for all pages
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly DEFAULT_TITLE = 'Ballu Art | Construction Chemicals, Tile Adhesives & Building Solutions Online';
  private readonly DEFAULT_DESCRIPTION = 'Buy construction chemicals, tile adhesives, waterproofing solutions & bonding agents online. Best prices, fast delivery across India. Quality certified construction materials.';
  private readonly BRAND = 'Ballu Art';

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {
    this.setDefaults();
  }

  /**
   * Set default meta tags
   */
  private setDefaults(): void {
    this.metaService.addTag({ name: 'charset', content: 'UTF-8' });
    this.metaService.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    this.metaService.addTag({ name: 'theme-color', content: '#1f2937' });
  }

  /**
   * Update page title and meta description
   * Use this for most pages
   */
  updatePageMeta(pageTitle: string, description: string, canonicalUrl?: string): void {
    // Set page title with brand suffix
    const fullTitle = pageTitle.includes(this.BRAND) 
      ? pageTitle 
      : `${pageTitle} | ${this.BRAND}`;
    this.titleService.setTitle(fullTitle);

    // Update meta description
    this.updateMetaTag('description', description);

    // Add canonical tag if provided
    if (canonicalUrl) {
      this.addCanonicalTag(canonicalUrl);
    }

    // Add Open Graph tags
    this.updateOGTags(pageTitle, description);
  }

  /**
   * Set homepage metadata (optimized for main keywords)
   */
  setHomePage(): void {
    const title = 'Construction Chemicals & Tile Adhesives Online | Buy Waterproofing Solutions | Ballu Art';
    const description = 'Buy construction chemicals, tile adhesives & waterproofing solutions online. Shop grouts, bonding agents, surface repair products & construction materials. Fast delivery, best prices, quality certified.';
    
    this.updatePageMeta(title, description, 'https://yourdomain.com/');
    this.updateOGTags(
      'Buy Construction Chemicals & Tile Adhesives Online - Ballu Art',
      'Best construction chemicals, tile adhesives, waterproofing solutions and building materials. Fast delivery across India.'
    );
  }

  /**
   * Set products listing page metadata
   */
  setProductsPage(): void {
    const title = 'Buy Tile Adhesives, Waterproofing & Construction Chemicals Online | Ballu Art';
    const description = 'Shop 100+ construction chemicals, tile adhesives, waterproofing solutions & bonding agents. Compare prices, expert recommendations, customer reviews. Fast India delivery, best prices guaranteed.';
    
    this.updatePageMeta(title, description, 'https://yourdomain.com/products');
  }

  /**
   * Set product detail page metadata (called with dynamic data)
   */
  setProductPage(productName: string, price: number, rating: number, reviews: number, description: string): void {
    const title = `${productName} - ₹${price} | Buy Online | Ballu Art`;
    const metaDescription = `${productName} at best price ₹${price}. Rating: ${rating}/5 (${reviews} reviews). ${description.substring(0, 70)}...`;
    
    this.updatePageMeta(title, metaDescription);
  }

  /**
   * Set product detail page metadata (alias for product page)
   */
  setProductDetailPage(): void {
    const title = 'Construction Chemical Product | Tile Adhesive & Building Material | Ballu Art';
    const description = 'View construction chemical product details, specifications, pricing & reviews. Shop tile adhesives, waterproofing solutions & bonding agents with guaranteed quality & fast delivery.';
    
    this.updatePageMeta(title, description);
  }

  /**
   * Set about page metadata
   */
  setAboutPage(): void {
    const title = 'About Ballu Art - Top Construction Chemical Supplier & Tile Adhesive Manufacturer India';
    const description = 'Learn about Ballu Art - India\'s leading construction chemicals, tile adhesives & waterproofing solutions supplier. Quality certified, trusted by professionals. About our mission & commitment.';
    
    this.updatePageMeta(title, description, 'https://yourdomain.com/about');
  }

  /**
   * Set contact page metadata
   */
  setContactPage(): void {
    const title = 'Contact Ballu Art - Construction Chemical Support, Bulk Orders & Inquiries';
    const description = 'Contact Ballu Art for tile adhesives, construction chemicals & waterproofing solutions. Bulk orders, product inquiries & support available. Customer support team ready to assist.';
    
    this.updatePageMeta(title, description, 'https://yourdomain.com/contact');
  }

  /**
   * Update individual meta tag
   */
  updateMetaTag(name: string, content: string): void {
    const tag = this.metaService.getTag(`name='${name}'`);
    if (tag) {
      this.metaService.updateTag({ name, content });
    } else {
      this.metaService.addTag({ name, content });
    }
  }

  /**
   * Add canonical tag to prevent duplicate content
   */
  private addCanonicalTag(url: string): void {
    const link = this.metaService.getTag('rel="canonical"');
    if (link) {
      this.metaService.updateTag({ rel: 'canonical', href: url });
    } else {
      this.metaService.addTag({ rel: 'canonical', href: url });
    }
  }

  /**
   * Update Open Graph tags for social media sharing
   */
  private updateOGTags(title: string, description: string): void {
    this.updateMetaTag('og:title', title);
    this.updateMetaTag('og:description', description);
    this.updateMetaTag('og:type', 'website');
    this.updateMetaTag('og:url', 'https://yourdomain.com');
    this.updateMetaTag('og:image', 'https://yourdomain.com/og-image.png');
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', title);
    this.updateMetaTag('twitter:description', description);
  }

  /**
   * Set checkout page metadata
   */
  setCheckoutPage(): void {
    const title = 'Checkout - Secure Ordering | Ballu Art Construction Chemicals & Tile Adhesives';
    const description = 'Secure checkout for construction chemicals, tile adhesives & waterproofing solutions. Multiple payment options, fast delivery, easy returns. Complete your construction material order now.';
    
    this.updatePageMeta(title, description, 'https://yourdomain.com/checkout');
  }

  /**
   * Set login page metadata
   */
  setLoginPage(): void {
    const title = 'Login - Ballu Art Construction Chemicals & Tile Adhesives Online Store';
    const description = 'Sign in to your Ballu Art account for construction chemicals & tile adhesives. Track orders, save products, exclusive member discounts on waterproofing solutions & bonding agents.';
    
    this.updatePageMeta(title, description, 'https://yourdomain.com/login');
  }

  /**
   * Set admin page metadata
   */
  setAdminPage(): void {
    const title = 'Admin Dashboard | Ballu Art Construction Chemicals Management';
    const description = 'Admin panel for managing construction chemicals, tile adhesives, waterproofing solutions, inventory, orders & product catalog.';
    
    this.updatePageMeta(title, description);
  }

  /**
   * Reset to default meta tags
   */
  resetToDefaults(): void {
    this.titleService.setTitle(this.DEFAULT_TITLE);
    this.updateMetaTag('description', this.DEFAULT_DESCRIPTION);
  }

  /**
   * Update page title only
   */
  setPageTitle(title: string): void {
    const fullTitle = title.includes(this.BRAND) 
      ? title 
      : `${title} | ${this.BRAND}`;
    this.titleService.setTitle(fullTitle);
  }

  /**
   * Update meta description only
   */
  setMetaDescription(description: string): void {
    this.updateMetaTag('description', description);
  }
}
