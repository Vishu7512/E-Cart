import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.product.currentCart().subscribe((result) => {

      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity)
        }
      })
      this.totalPrice = price + (price / 10) + 100 - (price / 10);

      console.warn(this.totalPrice);

    })

  }
  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id: undefined
      }

      this.cartData?.forEach((item) => {
        setTimeout(() => {
          item.id && this.product.deleteCartItems(item.id);
        }, 700)
      })

      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = "Order has been placed";
          setTimeout(() => {
            this.orderMsg = undefined;
            this.router.navigate(['/my-orders'])
          }, 4000);

        }

      })
    }

  }

}


// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { cart, order, product } from '../data-type';
// import { ProductService } from '../services/product.service';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {

//   totalPrice: number | undefined;
//   cartData: cart[] | undefined;
//   orderMsg: string | undefined;

//   constructor(private product: ProductService, private router: Router) { }

//   ngOnInit(): void {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as {
//       productData: product;
//       userDetails: any;
//       productQuantity: number;
//     };

//     let user = localStorage.getItem('user');
//     let userId = user && JSON.parse(user).id;

//     if (state) {
//       this.cartData = [{
//         ...state.productData,
//         quantity: state.productQuantity,
//         userId: userId,  // Include the userId here
//         productId: state.productData.id
//       }];
//       this.totalPrice = state.productData.price * state.productQuantity;
//     }

//     // If there's additional cart data from local storage, handle it as well
//     this.product.currentCart().subscribe((result) => {
//       if (!state) {
//         let price = 0;
//         this.cartData = result;
//         result.forEach((item) => {
//           if (item.quantity) {
//             price = price + (+item.price * +item.quantity);
//           }
//         });
//         this.totalPrice = price + (price / 10) + 100 - (price / 10);
//       }
//     });
//   }

//   orderNow(data: { email: string, address: string, contact: string }) {
//     let user = localStorage.getItem('user');
//     let userId = user && JSON.parse(user).id;
//     if (this.totalPrice) {
//       let orderData: order = {
//         ...data,
//         totalPrice: this.totalPrice,
//         userId,
//         id: undefined
//       };

//       this.cartData?.forEach((item) => {
//         setTimeout(() => {
//           item.id && this.product.deleteCartItems(item.id);
//         }, 700);
//       });

//       this.product.orderNow(orderData).subscribe((result) => {
//         if (result) {
//           this.orderMsg = "Order has been placed";
//           setTimeout(() => {
//             this.orderMsg = undefined;
//             this.router.navigate(['/my-orders']);
//           }, 4000);
//         }
//       });
//     }
//   }
// }

