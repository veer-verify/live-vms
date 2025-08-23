import { Component } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
selectedSite: string | null = null;
  siteName: string = 'Site Name';
  siteTeam: string = 'Your Team';
  emailBody: string = '';
  
  actionTag = '';
  category = '';
  subcategory = '';
  subcategories: Record<string, string[]> = {
    user: ['Signup', 'Login', 'Deactivation'],
    product: ['Launch', 'Update'],
    system: ['Downtime', 'Alert'],
    marketing: ['Newsletter', 'Offer']
  };

  sites = [
    { id: 'ecommerce', name: 'E-Commerce Store', status: 'Active', siteId: 'EC-2024-001', updated: '2:30 PM', statusClass: 'bg-green-100 text-green-800' },
    { id: 'blog', name: 'Tech Blog', status: 'Live', siteId: 'TB-2024-002', updated: '1:45 PM', statusClass: 'bg-blue-100 text-blue-800' },
    { id: 'portfolio', name: 'Portfolio Site', status: 'Draft', siteId: 'PS-2024-003', updated: '11:20 AM', statusClass: 'bg-purple-100 text-purple-800' },
    { id: 'corporate', name: 'Corporate Website', status: 'Active', siteId: 'CW-2024-004', updated: '9:15 AM', statusClass: 'bg-green-100 text-green-800' }
  ];

  get availableSubcategories(): string[] {
    return this.subcategories[this.category] || [];
  }

  showSiteDetails(siteId: string) {
    const site = this.sites.find(s => s.id === siteId);
    if (site) {
      this.selectedSite = siteId;
      this.siteName = site.name;
      this.siteTeam = `${site.name} Team`;
    }
  }

  updateSubcategories() {
    this.subcategory = '';
  }

  updateEmailTemplate() {
    if (this.actionTag && this.category && this.subcategory) {
      this.emailBody = `This is a <strong>${this.actionTag}</strong> email for the <strong>${this.subcategory}</strong> subcategory under <strong>${this.category}</strong>.`;
    } else {
      this.emailBody = '';
    }
  }

  cancelEmail() {
    this.actionTag = '';
    this.category = '';
    this.subcategory = '';
    this.emailBody = '';
  }

  sendEmail() {
    alert('Email sent!');
  }
}
