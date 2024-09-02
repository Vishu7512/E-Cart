import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, priceSummary, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  constructor(private product: ProductService, private router: Router) { }

  // ngOnInit(): void {
  //  this.loadDetails()

  // }


  ngOnInit(): void {
  this.loadDetails();

  const state = this.router.getCurrentNavigation()?.extras.state;
  if (state) {
    const productData = state['productData'];
    const productQuantity = state['productQuantity'];
    if (productData && productQuantity) {
      this.addToCart(productData, productQuantity);
    }
  }
}

addToCart(productData: product, quantity: number) {
  productData.quantity = quantity;

  // Check if the product is already in the cart
  const existingProduct = this.cartData?.find(item => item.productId === productData.id);

  if (!existingProduct) {
    this.product.localAddToCart(productData);
    this.loadDetails(); // Refresh the cart details to reflect the new addition
  }
}



  removeToCart(cartId:number|undefined){
    cartId && this.cartData && this.product.removeToCart(cartId)
    .subscribe((result)=>{
      this.loadDetails();
    })
  }

  loadDetails(){
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      console.warn(this.cartData);
      let price = 0;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity)
        }
      })
      this.priceSummary.price = price;
      this.priceSummary.discount = price / 10;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 100;
      this.priceSummary.total = price + (price / 10) + 100 - (price / 10);

    if(!this.cartData.length){
      this.router.navigate(['/'])
    }

    })
  }

  checkout() {
    this.router.navigate(['/checkout'])
  }

}
