import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { IProductCreate } from '@interfaces/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Partial<IProductCreate> | null = null;
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<IProductCreate>();

  name = '';
  description = '';
  price: number | null = null;
  sku = '';
  stock: number | null = null;

  ngOnChanges(): void {
    const p = this.product;
    if (p) {
      this.name = p.name ?? '';
      this.description = p.description ?? '';
      this.price = p.price ?? null;
      this.sku = p.sku ?? '';
      this.stock = p.stock ?? null;
    } else {
      this.name = '';
      this.description = '';
      this.price = null;
      this.sku = '';
      this.stock = null;
    }
  }

  onSubmit(): void {
    const price = this.price ?? 0;
    const stock = this.stock ?? 0;
    this.submitForm.emit({
      name: this.name.trim(),
      description: this.description.trim(),
      price,
      sku: this.sku.trim(),
      stock
    });
  }
}
