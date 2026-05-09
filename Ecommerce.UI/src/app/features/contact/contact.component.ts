import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmailService } from '../../services/email.service';
import { SeoService } from '../../services/seo.service';
import { APP_CONSTANTS } from '../../config/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var L: any; // Leaflet library

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [EmailService]
})
export class ContactComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  private mapInitialized = false;

  // Surendranagar, Gujarat location
  private readonly LOCATION = {
    name: 'BALLUART - Surendranagar, Gujarat',
    latitude: 22.7411,
    longitude: 71.6489,
    zoom: 13
  };

  constructor(
    private emailService: EmailService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.setContactPage();
    this.loadLeafletLibrary();
  }

  ngAfterViewInit(): void {
    // Initialize map after view is ready
    if (this.mapInitialized && typeof L !== 'undefined') {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load Leaflet library dynamically from CDN
   */
  private loadLeafletLibrary(): void {
    // Check if Leaflet is already loaded
    if (typeof L !== 'undefined') {
      this.mapInitialized = true;
      return;
    }

    // Load Leaflet CSS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(leafletCSS);

    // Load Leaflet JS
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    leafletScript.onload = () => {
      this.mapInitialized = true;
      // Initialize map after library loads
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    };
    document.head.appendChild(leafletScript);
  }

  /**
   * Initialize the map with Surendranagar location
   */
  private initializeMap(): void {
    if (typeof L === 'undefined') {
      console.error('Leaflet library not loaded');
      return;
    }

    try {
      // Create map centered on Surendranagar
      const map = L.map('map').setView(
        [this.LOCATION.latitude, this.LOCATION.longitude],
        this.LOCATION.zoom
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      // Create custom marker
      const markerIcon = L.divIcon({
        html: `
          <div class="custom-marker" style="
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            border: 3px solid white;
          ">
            📍
          </div>
        `,
        iconSize: [40, 40],
        className: 'custom-leaflet-marker'
      });

      // Add marker for BALLUART location
      const marker = L.marker(
        [this.LOCATION.latitude, this.LOCATION.longitude],
        { icon: markerIcon }
      ).addTo(map);

      // Add popup with location information
      const popupContent = `
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #1a202c; font-size: 14px; font-weight: 700;">
            🏭 BALLUART
          </h4>
          <p style="margin: 4px 0; color: #475569; font-size: 12px;">
            <strong>Location:</strong> Surendranagar, Gujarat, India
          </p>
          <p style="margin: 4px 0; color: #475569; font-size: 12px;">
            <strong>Latitude:</strong> ${this.LOCATION.latitude}°
          </p>
          <p style="margin: 4px 0; color: #475569; font-size: 12px;">
            <strong>Longitude:</strong> ${this.LOCATION.longitude}°
          </p>
          <p style="margin: 8px 0 0 0; color: #3b82f6; font-size: 11px; font-weight: 600;">
            ✓ Manufacturing & Distribution Center
          </p>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 250 });

      // Open popup by default
      marker.openPopup();

      console.log('Map initialized successfully with Surendranagar location');
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  submitForm() {
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.isLoading = true;
      this.errorMessage = '';

      this.emailService.sendEmail(this.formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.submitted = true;
            // Reset form
            this.formData = { name: '', email: '', subject: '', message: '' };
            // Hide success message after 5 seconds
            setTimeout(() => {
              this.submitted = false;
            }, 5000);
          },
          (error) => {
            this.isLoading = false;
            console.error('Email sending error:', error);
            this.errorMessage = 'Failed to send message. Please try again.';
            // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  }

  openWhatsApp() {
    if (this.formData.name && this.formData.email && this.formData.message) {
      // Create professionally formatted message with classic design
      const whatsappMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
    NEW INQUIRY FROM WEBSITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*SENDER INFORMATION*
Name: ${this.formData.name}
Email: ${this.formData.email}

*INQUIRY DETAILS*
Subject: ${this.formData.subject || 'General Inquiry'}

*MESSAGE*
${this.formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for reaching out!
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage.trim());
      
      // Open WhatsApp with pre-filled message
      const whatsappUrl = `https://wa.me/${APP_CONSTANTS.WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } else {
      this.errorMessage = 'Please fill in all required fields (Name, Email, Message).';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  }
}
