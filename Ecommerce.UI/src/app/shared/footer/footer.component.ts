import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  // Product categories for internal linking
  categories = [
    { name: 'Tile Adhesives', slug: 'tile-adhesives' },
    { name: 'Waterproofing Solutions', slug: 'waterproofing-solutions' },
    { name: 'White Cement', slug: 'white-cement' },
    { name: 'Construction Chemicals', slug: 'construction-chemicals' },
    { name: 'Surface Repair Solutions', slug: 'surface-repair-solutions' },
    { name: 'Bonding Agents & Additives', slug: 'bonding-agents-additives' },
    { name: 'Grouts & Fillers', slug: 'grouts-fillers' },
    { name: 'Stone & Marble Solutions', slug: 'stone-marble-solutions' }
  ];
}
