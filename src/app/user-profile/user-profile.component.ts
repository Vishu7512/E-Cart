import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userData: any;
  editMode: boolean = false;
  editForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: [''],
      email: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    const userStore = localStorage.getItem('user');
    if (userStore) {
      this.userData = JSON.parse(userStore);
      this.editForm.patchValue(this.userData);
    } else {
      // Redirect to login if no user is logged in
      this.router.navigate(['/user-auth']);
    }
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  saveChanges(): void {
    const updatedData = this.editForm.value;
    this.userService.updateUserData(this.userData.id, updatedData).subscribe(
      () => {
        this.userData = updatedData;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.editMode = false;
      },
      (error) => {
        console.error('Failed to update user data', error);
      }
    );

    Swal.fire({
  position: "top-end",
  icon: "success",
  title: "Your work has been saved",
  showConfirmButton: false,
  timer: 1500
});
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editForm.patchValue(this.userData);
  }
}
