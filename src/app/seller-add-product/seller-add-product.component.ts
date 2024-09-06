

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  addProductMessage: string | undefined;
  selectedImage: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private product: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize reactive form
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file; // Assign the selected file to selectedImage
      this.addProductForm.patchValue({ image: file.name });
    }
  }

  submit(): void {
    if (this.selectedImage && this.addProductForm.valid) {
      this.isLoading = true;
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;

        const productData = {
          name: this.addProductForm.value.name,
          price: this.addProductForm.value.price,
          category: this.addProductForm.value.category,
          description: this.addProductForm.value.description,
          image: base64Image, // Send image as base64 string
        };

        this.product.addProduct(productData).subscribe((result) => {
          if (result) {
            Swal.fire({
              title: 'Submit',
              text: 'Your Product has been added!',
              icon: 'success',
            });
            this.router.navigate(['/seller-home']);
          }
          this.isLoading = false;
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














// import { Component, OnInit } from '@angular/core';
// import { product } from '../data-type';
// import { ProductService } from '../services/product.service';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-seller-add-product',
//   templateUrl: './seller-add-product.component.html',
//   styleUrls: ['./seller-add-product.component.css'],
// })
// export class SellerAddProductComponent implements OnInit {
//   addProductMessage: string | undefined;
//   selectedImage: File | null = null;
//     isLoading = false;


//   constructor(private product: ProductService, private router: Router) {}

//   ngOnInit(): void {}

//   onFileSelected(event: any): void {
//     const file: File = event.target.files[0];
//     if (file) {
//       this.selectedImage = file; // Assign the selected file to selectedImage
//     }
//   }

//   submit(data: product): void {
//     if (this.selectedImage) {
//        this.isLoading = true;
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64Image = reader.result as string;

//         const productData = {
//           name: data.name,
//           price: data.price,
//           category: data.category,
//           description: data.description,
//           image: base64Image // Send image as base64 string
//         };

//         this.product.addProduct(productData).subscribe((result) => {
//           if (result) {
            
//             // this.addProductMessage = 'Product is added successfully';
//             Swal.fire({
//               title: "Submit",
//               text: "Your Product has been added!",
//               icon: "success"
//             });
//            this.
//            router.navigate(['/seller-home']);
//           }
//             this.isLoading = false;
//         });

        

//         setTimeout(() => {
//           this.addProductMessage = undefined;
//           this.router.navigate(['/seller-home']);
//         }, 2000);
//       };

//       reader.readAsDataURL(this.selectedImage); // Convert image to base64
//     }
//   }
// }








