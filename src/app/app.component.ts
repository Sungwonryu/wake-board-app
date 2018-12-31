import { Component } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthService
  ) {

    this.authService.login({
      email: 'admin1@test.com',
      password: '12345678'
    });
  }

}
