import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
      this.selectedImage = file; // Assign the selected file to selectedImage
    }
  }

  submit(data: product): void {
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;

        const productData = {
          name: data.name,
          price: data.price,
          category: data.category,
          description: data.description,
          image: base64Image // Send image as base64 string
        };

        this.product.addProduct(productData).subscribe((result) => {
          if (result) {
            // this.addProductMessage = 'Product is added successfully';
              Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Product is added successfully",
            showConfirmButton: false,
            timer: 1500
          });
           this.router.navigate(['/seller-home']);
          }
        });

        

        setTimeout(() => {
          this.addProductMessage = undefined;
          this.router.navigate(['/seller-home']);
        }, 2000);
      };

      reader.readAsDataURL(this.selectedImage); // Convert image to base64
    }
  }
}
