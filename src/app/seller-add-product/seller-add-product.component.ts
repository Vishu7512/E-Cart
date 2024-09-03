import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage: string | undefined;
  selectedImage: File | null = null;

  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  submit(data: product): void {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('color', data.color);
      formData.append('description', data.description);
      formData.append('image', this.selectedImage); // Append the selected image file

      this.product.addProduct(formData).subscribe((result) => {
        if (result) {
          this.addProductMessage = 'Product is added successfully';
          this.router.navigate(['/seller-home']);
        }
      });

      setTimeout(() => {
        this.addProductMessage = undefined;
        this.router.navigate(['/seller-home']);
      }, 2000);
    }
  }
}
