import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Subject } from 'rxjs';

import { HDate } from '../shared/lib/h-date';
import { HList } from '../shared/lib/h-list';
import { HObject } from '../shared/lib/h-object';

import { environment } from '../../environments/environment';
import { ApiOpts, BaseParamsObj } from './api-storage.model';
import { AuthService } from '../auth/auth.service';
// import { UIService } from '../shared/ui/ui.service';

@Injectable()
export class ApiStorageService {

  defaults = {
    url: environment.urls.api,
    httpMethod: 'get'
  };
  httpMethods = ['get', 'patch', 'post', 'put', 'delete'];
  objectsRequireDate = ['vessel_assignments', 'slip_assignments', 'crew_swaps', 'notes'];
  actionsRequireUserId = ['insert', 'update', 'delete', 'lock', 'unlock', 'override'];
  excludeProps = ['object'];

  HObject = HObject;
  HList = HList;
  HDate = HDate;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  /**
   *  getUrl() returns defaults.url if url is not a non-empty string
  */
  getUrl(url?: string) {
    if (!url || typeof url !== 'string') {
      url = this.defaults.url;
    }
    return url;
  }

  /**
   *  getHttpMethod() returns httpMethod by using baseParamsObj.action
   *  unless httpMethod is set manually
  */
  getHttpMethod(baseParamsObj: BaseParamsObj, httpMethod?: any) {
    if (!httpMethod || !this.httpMethods.includes(httpMethod)) {
      // When httpMethod is not found from this.httpMethod
      const action = baseParamsObj.action;
      if (action && typeof action === 'string') {
        // When action is found in the following action list,
        // set httpMethod based on the action
        switch (action) {
          case 'insert':
          case 'update':
            httpMethod = 'post';
            break;
          case 'read':
          case 'delete':
          case 'lock':
          case 'unlock':
          case 'override':
            httpMethod = 'get';
            break;
          default:
            // When action is not one of switch cases
            // set httpMethod as this.defaults.httpMethod
            httpMethod = this.defaults.httpMethod;
        }
      } else {
        // When action is not found in the following action list,
        // set httpMethod as this.defaults.httpMethod
        httpMethod = this.defaults.httpMethod;
      }
    }
    return httpMethod;
  }

  getUser(baseParamsObj) {
    const action = baseParamsObj.action;
    const requireUserId = this.actionsRequireUserId.includes(action);
    const currentUser = this.authService.user;

    if (requireUserId && currentUser) {
      return currentUser;
    }
  }

  /**
   *  processApi() creates HttpParams instance, params using paramsObj
   *  and invokes httpClient call
   *  An observable returning from HttpClient call will be returned
  */
  processApi({ url, httpMethod, baseParamsObj, apiObj }: ApiOpts) {
    url = this.getUrl(url);
    httpMethod = this.getHttpMethod(baseParamsObj, httpMethod);
    const user = this.getUser(baseParamsObj);
    if (user && typeof user === 'object' && user.id) {
      baseParamsObj['user_id'] = user.id;
    }

    // Create paramsObj by combining baseParamsObj and apiObj
    const paramsObj = { ...baseParamsObj, ...apiObj };
    // Create params as an instance of HttpParams from paramsObj
    const params = new HttpParams({ fromObject: paramsObj });

    // Show progressbar right before http calls start
    // this.uiService.showProgressbar();

    // Return this.httpClient observer
    switch (httpMethod) {
      case 'post':
        return this.httpClient[httpMethod](url, params.toString(),
          { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }
        );
      default:
        // When httpMethod is 'get'
        return this.httpClient[httpMethod](url, { params: params });
    }
  }

}
