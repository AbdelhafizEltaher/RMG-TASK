import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductFormComponent } from '@features/products/product-form/product-form.component';
import { ProductService } from '@services/product.service';
import type { IProductCreate } from '@interfaces/product.interface';

@Component({
  selector: 'app-product-new',
  standalone: true,
  imports: [ProductFormComponent, RouterLink],
  templateUrl: './product-new.component.html',
})
export class ProductNewComponent {
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  onSubmit(product: IProductCreate): void {
    this.loading = true;
    this.productService.create(product).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.loading = false;
      },
    });
  }
}
