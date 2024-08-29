import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
// userData:any
  constructor() { }

  ngOnInit(): void {
    // this.userData = history.state.user[0];
    // console.log(this.userData);
  }

}
