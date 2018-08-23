import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logged:any = null;

  constructor(private user:UsersService) {
    this.logged = this.user.logged;
  }
  ngOnInit() {
  }

  doLogout() {
    this.user.doLogout();
  }

}
