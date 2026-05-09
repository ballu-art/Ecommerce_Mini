import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Portfolio Website';
  
  // WhatsApp button drag properties
  isDragging = false;
  buttonPosition = { x: 0, y: 0 };
  dragOffset = { x: 0, y: 0 };
  isClickOnly = true;
  buttonSize = 54;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
    
    // Initialize button position
    this.initializeButtonPosition();
  }

  initializeButtonPosition(): void {
    // Load saved button position or set default to bottom-right
    const savedPos = localStorage.getItem('whatsappButtonPos');
    if (savedPos) {
      this.buttonPosition = JSON.parse(savedPos);
      // Validate position is within bounds
      this.validateButtonPosition();
    } else {
      // Set initial position to bottom-right
      this.setDefaultPosition();
    }
  }

  setDefaultPosition(): void {
    const padding = 20;
    this.buttonPosition = {
      x: window.innerWidth - this.buttonSize - padding,
      y: window.innerHeight - this.buttonSize - padding
    };
    this.validateButtonPosition();
  }

  validateButtonPosition(): void {
    const maxX = window.innerWidth - this.buttonSize - 10;
    const maxY = window.innerHeight - this.buttonSize - 10;

    this.buttonPosition.x = Math.max(5, Math.min(this.buttonPosition.x, maxX));
    this.buttonPosition.y = Math.max(5, Math.min(this.buttonPosition.y, maxY));
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // Re-validate button position on window resize (orientation change)
    this.validateButtonPosition();
  }

  onWhatsAppMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.isClickOnly = true;
    
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    
    this.dragOffset.x = event.clientX - rect.left;
    this.dragOffset.y = event.clientY - rect.top;
  }

  onWhatsAppTouchStart(event: TouchEvent): void {
    if (event.touches.length === 0) return;
    
    this.isDragging = true;
    this.isClickOnly = true;
    
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const touch = event.touches[0];
    
    this.dragOffset.x = touch.clientX - rect.left;
    this.dragOffset.y = touch.clientY - rect.top;
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDocumentMouseMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    this.isClickOnly = false;
    
    let clientX: number;
    let clientY: number;
    
    if (event instanceof TouchEvent) {
      if (event.touches.length === 0) return;
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    const newX = clientX - this.dragOffset.x;
    const newY = clientY - this.dragOffset.y;

    // Keep button within viewport bounds
    const maxX = window.innerWidth - this.buttonSize;
    const maxY = window.innerHeight - this.buttonSize;

    this.buttonPosition.x = Math.max(0, Math.min(newX, maxX));
    this.buttonPosition.y = Math.max(0, Math.min(newY, maxY));
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onDocumentMouseUp(): void {
    this.isDragging = false;
    // Save position to localStorage
    localStorage.setItem('whatsappButtonPos', JSON.stringify(this.buttonPosition));
  }

  openWhatsApp(): void {
    // Only open WhatsApp if it's a click (not a drag)
    if (this.isClickOnly) {
      const phoneNumber = '918460315245'; // WhatsApp phone number
      const message = 'Hi! I am interested in your construction chemicals. Can you help me?';
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  }
}
