import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: string = '';
  signUpForm: FormGroup;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private user: UserService, private product: ProductService) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  signUp() {
    if (this.signUpForm.valid) {
      this.user.userSignUp(this.signUpForm.value);
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.user.userLogin(this.loginForm.value);
      this.user.invalidUserAuth.subscribe((result) => {
        if (result) {
          this.authError = "User not found";
        } else {
          this.localCartToRemoteCart();
        }
      });
    }
  }

  openSignUp() {
    this.showLogin = false;
  }

  openLogin() {
    this.showLogin = true;
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: any[] = JSON.parse(data);

      cartDataList.forEach((product: any, index: number) => {
        let cartData = {
          ...product,
          productId: product.id,
          userId
        };
        delete cartData.id;

        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn("data is stored in DB");
            }
          });
        }, 500);

        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });
    }

    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);
  }
}
