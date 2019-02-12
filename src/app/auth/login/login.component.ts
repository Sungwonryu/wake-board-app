import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password: string = '';
  failed: boolean = false;

  subtitle = 'Log in with your Windows Active Directory Account using the fields below.';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log('form', form);
    this.failed = !(this.authService.login({
      name: form.value.name,
      password: form.value.password
    }));
  }

}
