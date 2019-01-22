import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { HObject } from '../shared/lib/h-object';
import { environment } from '../../environments/environment';
import { ListUpdate } from '../api-storage/api-storage.model';
import { AuthData, User } from './user.model';
import { UIService } from '../shared/services/ui.service';


@Injectable()
export class AuthService {
  HObject = HObject;

  url = environment.urls.userData;
  previousUrl: string = '/';
  expirationDelay = 3600000; // 1 hour


  user: User;
  userList: User[] = [];
  $authChange = new Subject<boolean>();
  $userListUpdate = new Subject<ListUpdate>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private location: Location,
    private uiService: UIService
  ) {
    this.user = this.getUserFromLocalStorage();
    this.setUserList();
    console.log('AuthService is instantiated. userList: ', this.userList);
  }

  isValidUser(user: User): boolean {
    let isValid = false;
    if (user && typeof user === 'object' &&
        Number.isInteger(user.expiration) &&
        user.expiration > (new Date()).getTime()) {
      // When user is an object and user.expiration is bigger than current time
      // set isValid as true
      isValid = true;
    }
    return isValid;
  }

  getUserFromLocalStorage(): User {
    let user = null;
    const userData: User = JSON.parse(localStorage.getItem('user'));
    if (userData && typeof userData === 'object') {
      if (this.isValidUser(userData)) {
        user = userData;
      }
    }
    return user;
  }

  getUserListFromLocalStorage(): User[] {
    let userList = [];
    const listData = JSON.parse(localStorage.getItem('userList'));
    if (listData && typeof listData === 'object' && listData.constructor === Array && listData.length) {
      userList = listData;
    }
    return userList;
  }

  setUserList() {
    this.userList = this.getUserListFromLocalStorage();
    this.httpClient.get(this.url).subscribe(
      (res: any) => {
        if (typeof res === 'object' && res.constructor === Array) {
          this.userList = res;
          localStorage.setItem('userList', JSON.stringify(this.userList));
        } else {
          console.log('Error, API retrieved userList is not valid. userList: ', res);
        }
      },
      (err) => {
        console.log('Error, API userList retrieval fails. Error: ', err);
      }
    );
  }

  isAuth(): boolean {
    let auth = false;
    if (this.user && typeof this.user === 'object' &&
        Number.isInteger(this.user.expiration) &&
        this.user.expiration > (new Date()).getTime()) {
      // When this.user is not null and this.user.expiration is bigger than current time
      // set auth as true
      auth = true;
    }
    return auth;
  }

  loginSuccessfully() {
    if (this.previousUrl) {
      this.previousUrl = null;
      this.router.navigate(['/']);
    } else {
      this.location.back();
    }
    localStorage.setItem('user', JSON.stringify(this.user));
    this.$authChange.next(true);
  }

  login(authData: AuthData) {
    let matchedUser = this.userList.find((user: User) => {
      return user.email === authData.email && user.password === authData.password;
    });
    if (matchedUser) {
      this.user = matchedUser;
      this.user.expiration = (new Date()).getTime() + this.expirationDelay;
      this.loginSuccessfully();
      // Show the login success message snackbar

      this.uiService.showAuthSnackbar({
        message: `${this.user.name}, login successfully!`,
        success: true
      });
    } else {
      // Show the login failure message snackbar
      this.uiService.showAuthSnackbar({
        message: 'Sorry, login failed!',
        success: false
      });
    }
  }

  extendUserExpiration() {
    if (this.user && this.isAuth()) {
      this.user.expiration = (new Date()).getTime() + this.expirationDelay;
      this.$authChange.next(true);
    } else {
      this.user = null;
      this.$authChange.next(false);
    }
  }

  logout() {
    const username = this.user.name;
    this.$authChange.next(false);
    this.user = null;
    localStorage.setItem('user', JSON.stringify(this.user));
    this.uiService.showSnackbar({
      message: `${username}, log out successfully!`
    });
    this.previousUrl = '/';
    this.router.navigate(['/main/login']);
  }
}
