import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '@services/invoice.service';
import { ProductService } from '@services/product.service';
import type { IProduct } from '@interfaces/product.interface';
import { DecimalPipe } from '@angular/common';
import { CustomDropdown } from '@components/common/custom-dropdown/custom-dropdown';
import { CustomCalendar } from "@components/common/custom-calendar/custom-calendar";

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, CustomDropdown, CustomCalendar],
  templateUrl: './invoice-create.component.html',
})
export class InvoiceCreateComponent implements OnInit {
  products = signal<IProduct[]>([]);
  customerName = '';
  dueDate = signal<Date | undefined>(undefined);
  tax = 0;
  /** Line items: productId, productName, quantity, unitPrice */
  items: { productId: number; productName: string; quantity: number; unitPrice: number }[] = [];
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private invoiceService: InvoiceService,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    this.dueDate.set(d);
    this.productService.getAll().subscribe({
      next: (list) => this.products.set(list),
      error: () => this.error.set('Could not load products'),
    });
  }

  addLine(): void {
    const list = this.products();
    if (list.length === 0) return;
    const p = list[0];
    this.items.push({
      productId: p.id,
      productName: p.name,
      quantity: 1,
      unitPrice: p.price,
    });
  }

  removeLine(index: number): void {
    this.items.splice(index, 1);
  }

  getSubtotal(): number {
    return this.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }

  getTotal(): number {
    return this.getSubtotal() * (1 + this.tax / 100);
  }

  submit(): void {
    this.error.set(null);
    if (!this.customerName.trim()) {
      this.error.set('Enter customer name');
      return;
    }
    if (this.items.length === 0) {
      this.error.set('Add at least one line item');
      return;
    }
    this.loading.set(true);
    this.invoiceService
      .create({
        customerName: this.customerName.trim(),
        dueDate: this.dueDate()?.toISOString().slice(0, 10) ?? '',
        items: this.items,
        tax: this.tax,
      })
      .subscribe({
        next: () => this.router.navigate(['/invoices']),
        error: (err) => {
          this.error.set(err?.message || 'Failed to create invoice');
          this.loading.set(false);
        },
      });
  }
}
