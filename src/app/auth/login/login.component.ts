import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  subtitle = 'Log in with your Windows Active Directory Account using the fields below.';

  constructor() { }

  ngOnInit() {
  }

}
