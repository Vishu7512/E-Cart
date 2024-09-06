
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | product;
  productMessage: undefined | string;
  isLoading=false
  constructor(private route: ActivatedRoute, private product: ProductService , private router:Router) {}

  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    console.warn(productId);
    productId &&
      this.product.getProduct(productId).subscribe((data) => {
        console.warn(data);
        this.productData = data;
      });
  }
  submit(data: any) {
    if (this.productData) {
      data.id = this.productData.id;
      this.isLoading=true
    }
    this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product has updated';
        Swal.fire({
  position: "center",
  icon: "success",
  title: "Product has been updated",
  showConfirmButton: false,
  timer: 1500
});
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
      this.router.navigate(['/seller-home']);
    }, 2000);
    console.warn(data);
    this.isLoading=false
  }
}
