import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  popularProducts: undefined | product[];
  trendyProducts: undefined | product[];
  cartItems = 0;

  constructor(private product: ProductService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data) => {
      this.popularProducts = data;
    });

    this.product.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    });

    let cartData= localStorage.getItem('localCart');
    if(cartData){
      console.log(cartData)
      this.cartItems= JSON.parse(cartData).length
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems= items.length
    })
  }

  handleAddToCart(item: product): void {
    const user = localStorage.getItem('user');
    if (!user) {
      // If the user is not logged in, navigate to the login page
      this.router.navigate(['/user-auth']);
    } else {
      // If the user is logged in, proceed with adding to cart
      this.router.navigate([`/details/${item.id}`]);
    }
  }
}
