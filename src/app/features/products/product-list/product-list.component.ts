import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, NgClass } from '@angular/common';
import { ProductService } from '@services/product.service';
import type { IProduct } from '@interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, NgClass],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products = signal<IProduct[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getAll().subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Failed to load products. Is the API running? Run: npm run api');
        this.loading.set(false);
      }
    });
  }

  deleteProduct(product: IProduct, event: Event): void {
    event.preventDefault();
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => this.error.set(err?.message || 'Failed to delete product')
    });
  }
}
