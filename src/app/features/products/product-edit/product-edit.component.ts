import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '@services/product.service';
import type { IProduct, IProductCreate } from '@interfaces/product.interface';
import { ProductFormComponent } from '@features/products/product-form/product-form.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ProductFormComponent, RouterLink],
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {
  product = signal<IProduct | null>(null);
  loading = signal(false);
  loadError = signal<string | null>(null);

  private id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (isNaN(id)) {
      this.router.navigate(['/products']);
      return;
    }
    this.id = id;
    this.productService.getById(id).subscribe({
      next: (p) => this.product.set(p),
      error: () => this.loadError.set('Product not found')
    });
  }

  onSubmit(updated: IProductCreate): void {
    if (this.id == null) return;
    this.loading.set(true);
    this.productService.update(this.id, updated).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => this.loading.set(false)
    });
  }
}
