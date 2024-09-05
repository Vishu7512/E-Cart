import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cart, order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  orderMsg: string | undefined;
  checkoutForm!: FormGroup;

  constructor(
    private product: ProductService,
    private router: Router,
    private fb: FormBuilder // Inject FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form group
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.product.currentCart().subscribe((result) => {
      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity);
        }
      });
      this.totalPrice = price + (price / 10) + 100 - (price / 10);
    });
  }

  orderNow(): void {
    if (this.checkoutForm.valid && this.totalPrice) {
      const data = this.checkoutForm.value;
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;

      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id: undefined
      };

      this.cartData?.forEach((item) => {
        setTimeout(() => {
          item.id && this.product.deleteCartItems(item.id);
        }, 700);
      });

      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = 'Order has been placed';
          setTimeout(() => {
            this.orderMsg = undefined;
            this.router.navigate(['/order-summary'], {
              state: {
                productData: this.cartData, // Pass cart data
                userDetails: data,          // Pass user details
                productQuantity: this.cartData?.[0]?.quantity || 1
              }
            });
          }, 2000);
        }
      });
    }
  }
}
