
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  searchText: string = '';
  sellerName: string = '';
  userName: string = '';
  searchResult: undefined | product[];
  cartItems = 0;
  icons = faCartShopping;
  icon = faSearch;
  user = faUserCircle;
  profile = faCaretDown;
  isDropdownOpen = false;
  //  isLoading = true;

  constructor(private route: Router, private product: ProductService) {}

  ngOnInit(): void {
    this.checkUserOrSeller();

    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkUserOrSeller();
      }
    });

    // Load cart data
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
  }

  checkUserOrSeller(): void {
    //  this.isLoading = true;
    if (localStorage.getItem('seller')) {
      let sellerStore = localStorage.getItem('seller');
      let sellerData = sellerStore && JSON.parse(sellerStore)[0];
      this.sellerName = sellerData.name;
      this.menuType = 'seller';
    } else if (localStorage.getItem('user')) {
      let userStore = localStorage.getItem('user');
      let userData = userStore && JSON.parse(userStore);
      this.userName = userData.name;
      this.menuType = 'user';
      this.product.getCartList(userData.id);
    } else {
      this.menuType = 'default';
    }
    //  this.isLoading = false;
  }

  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/seller-auth']);
  }

  userLogout() {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    this.product.cartData.emit([]);
  }

  UserProfile() {
    const userStore = localStorage.getItem('user');
    if (userStore) {
      const userData = JSON.parse(userStore);
      this.route.navigate(['/user-profile'], { state: { user: JSON.stringify(userData) } });
    }
  }

  searchProduct(query: KeyboardEvent): void {
    if (query) {
      const element = query.target as HTMLInputElement;
      const searchText = element.value.trim();

      if (searchText) {
        this.product.searchProduct(searchText).subscribe((result) => {
          if (result.length > 5) {
            result.length = 5;
            this.searchResult = result;
          }
        });
      } else {
        this.searchResult = [];
      }
    }
  }

  hideSearch() {
    this.searchResult = undefined;
  }

  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id]);
  }

  submitSearch(event: KeyboardEvent, val: string): void {
    if (event.key === 'Enter') {
      this.route.navigate([`search/${val}`]);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}


















// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { product } from '../data-type';
// import { ProductService } from '../services/product.service';
// import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
// import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css'],
// })
// export class HeaderComponent implements OnInit {
//   menuType: string = 'default';
//   searchText: string = '';
//   sellerName:string="";
//   userName:string="";
//   searchResult:undefined|product[];
//   cartItems = 0;
//   icons = faCartShopping;
//   icon = faSearch;
//   user = faUserCircle;
//   profile = faCaretDown;
//   isDropdownOpen = false;
//   // searchtext:any
//   constructor(private route: Router, private product:ProductService) {}

//   ngOnInit(): void {
//     this.route.events.subscribe((val: any) => {
//       if (val.url) {
//         if (localStorage.getItem('seller') && val.url.includes('seller')) {
//          let sellerStore=localStorage.getItem('seller');
//          let sellerData =sellerStore && JSON.parse(sellerStore)[0];
//          this.sellerName=sellerData.name;
//           this.menuType = 'seller';
//         }
//         else if(localStorage.getItem('user')){
//           let userStore = localStorage.getItem('user');
//           let userData = userStore && JSON.parse(userStore);
//           this.userName= userData.name;
//           this.menuType='user';
//           this.product.getCartList(userData.id);
//         }
//          else {
//           this.menuType = 'default';
//         }
//       }
//     });
//     let cartData = localStorage.getItem('localCart');
//     if (cartData) {
//       this.cartItems = JSON.parse(cartData).length;
//     }
//     this.product.cartData.subscribe((items) => {
//       this.cartItems = items.length;
//     });
//   }
//   logout(){
//     localStorage.removeItem('seller');
//     this.route.navigate(['/'])
//   }

//   userLogout(){
//     localStorage.removeItem('user');
//     this.route.navigate(['/user-auth'])
//     this.product.cartData.emit([])
//   }


//  UserProfile() {
//     const userStore = localStorage.getItem('user');
//     if (userStore) {
//       const userData = JSON.parse(userStore);
//       // Pass user data to the user profile component via state
//       this.route.navigate(['/user-profile'], { state: { user: JSON.stringify(userData) } });
//     }
//   }

// searchProduct(query: KeyboardEvent): void {
//   if (query) {
//     const element = query.target as HTMLInputElement;
//     const searchText = element.value.trim(); // Get the search text

//     if (searchText) {
//       this.product.searchProduct(searchText).subscribe((result) => {
//        if(result.length>5){
//         result.length=5
//         this.searchResult = result;}
//       });
//     } else {
//       this.searchResult = []; // Clear the search result if input is empty
//     }
//   }
// }


//   hideSearch(){
//     this.searchResult=undefined
//   }
//   redirectToDetails(id:number){
//     this.route.navigate(['/details/'+id])
//   }
//   // submitSearch(val:string){
//   //   console.warn(val)
//   // this.route.navigate([`search/${val}`]);
//   // }
//   submitSearch(event: KeyboardEvent, val: string): void {
//     if (event.key === 'Enter') {
//       this.route.navigate([`search/${val}`]);
//     }
//   }

//   toggleDropdown() {
//   this.isDropdownOpen = !this.isDropdownOpen;
// }
// }