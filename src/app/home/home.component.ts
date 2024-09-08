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

   // Pagination properties
   pageSize = 8; // Number of items per page
   currentPage = 1;
   paginatedData: product[] = [];
   totalPages = 0;
   totalPagesArray: number[] = [];

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








// import { Component, OnInit } from '@angular/core';
// import { product } from '../data-type';
// import { ProductService } from '../services/product.service';
// import { Router } from '@angular/router'; // Import Router

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
// })
// export class HomeComponent implements OnInit {
//   popularProducts: product[] | undefined;
//   trendyProducts: product[] | undefined;
//   cartItems = 0;

//   // Pagination properties
//   pageSize = 8; // Number of items per page
//   currentPage = 1;
//   paginatedData: product[] = [];
//   totalPages = 0;
//   totalPagesArray: number[] = [];

//   constructor(private product: ProductService, private router: Router) {}

//   ngOnInit(): void {
//     this.product.trendyProducts().subscribe((data) => {
//       this.trendyProducts = data;
  
//       // Ensure trendyProducts is not undefined before proceeding
//       if (this.trendyProducts) {
//         // Calculate the total number of pages based on the number of items
//         this.totalPages = Math.ceil(this.trendyProducts.length / this.pageSize);
//         this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
//         // Update the displayed data based on the current page
//         this.updatePaginatedData();
//       }
//     });
//   }

//   handleAddToCart(item: product): void {
//     const user = localStorage.getItem('user');
//     if (!user) {
//       // If the user is not logged in, navigate to the login page
//       this.router.navigate(['/user-auth']);
//     } else {
//       // If the user is logged in, proceed with adding to cart
//       this.router.navigate([`/details/${item.id}`]);
//     }
//   }

//   // Update the displayed data based on the current page
//   updatePaginatedData() {
//     // Check if trendyProducts exists and is not undefined
//     if (this.trendyProducts) {
//       const startIndex = (this.currentPage - 1) * this.pageSize;
//       const endIndex = startIndex + this.pageSize;
//       this.paginatedData = this.trendyProducts.slice(startIndex, endIndex);
//     }
//   }
  
//   // Change the current page and update the displayed data
//   changePage(page: number) {
//     if (page > 0 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.updatePaginatedData();
//     }
//   }
// }
