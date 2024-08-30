import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../services/seller.service';


@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent implements OnInit {
  showLogin = true;
  authError: String = '';
  loginForm: FormGroup;

  constructor(private seller: SellerService, private fb: FormBuilder) {
    this.seller.reloadSeller();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    
  }

  login(): void {
    if (this.loginForm.valid) {
      this.seller.userLogin(this.loginForm.value);
      this.seller.isLoginError.subscribe((isError) => {
        if (isError) {
          this.authError = 'Email or password is not correct';
        }
      });
    }
  }

  openLogin() {
    this.showLogin = true;
  }
}
