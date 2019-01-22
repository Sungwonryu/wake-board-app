import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { HObject } from '../shared/lib/h-object';
import { environment } from '../../environments/environment';
import { HList, SortOption } from '../shared/lib/h-list';
import { HDate } from '../shared/lib/h-date';
import { ApiOpts, ApiResponse, ListUpdate } from './api-storage.model';
import { BaseData } from './base-data';
import { ApiStorageService } from './api-storage.service';
import { AuthService } from '../auth/auth.service';
import { ParamsService } from '../shared/services/params.service';
import { UIService } from '../shared/services/ui.service';

@Injectable()
export class BaseDataService {
  HObject = HObject;
  HList = HList;
  HDate = HDate;
  BaseData = BaseData;

  // url = 'https://nycferry.hialabs.com/action.php';
  url = environment.urls.api;
  objectsRequireDate = ['vessel_assignments', 'slip_assignments', 'crew_swaps', 'notes'];
  actionsRequireUserId = ['insert', 'update', 'delete', 'lock', 'unlock', 'override'];
  actionsRequireAuth = ['insert', 'update', 'delete', 'lock', 'unlock', 'override'];

  autoUpdateTimeoutId: any = null;
  autoUpdateInterval = 600000; // 10 min
  instantUpdateTimeoutId: any = null;
  instantUpdateInterval = 400; // 400 ms

  actionsWithZeroRowcount = ['read'];
  objectsWithZeroRowcountRead = ['vessel_assignments', 'slip_assignments', 'crew_swaps', 'notes'];

  object: string = '';
  isLoaded: boolean = false;

  item: any = null;
  list: any[] = [];
  filteredList: any[] = [];
  sortOptions: SortOption[] = [{ property: 'id', isDescending: false }];

  $listUpdate = new Subject<ListUpdate>();
  $apiResponse = new Subject<ApiResponse>();

  constructor(
    protected apiStorageService: ApiStorageService,
    protected authService: AuthService,
    protected paramsService: ParamsService,
    protected uiService: UIService
  ) { }

  init() {
    if (this.list.length) {
      this.api('read');
    }
    console.log(`${this.object} service is instantiated`);
  }

  requireDate(object: string = this.object) {
    return this.objectsRequireDate.includes(object);
  }

  setItem(item: any) {
    if (item && typeof item === 'object') {
      this.item = item;
    }
  }

  findItem(searchOpts, listName: string = 'filteredList') {
    const list = this[listName];
    if (list && typeof list === 'object' && list.constructor === Array && list.length &&
      searchOpts && typeof searchOpts === 'object') {

      for (let prop in searchOpts) {
        if (searchOpts.hasOwnProperty(prop)) {
          const val = searchOpts[prop];
          const matchedItem = list.find((item: any) => item[prop] === val);
          if (matchedItem) {
            return matchedItem;
          }
        }
      }
    }
  }

  getDefaultList(listData: any[]) {
    const userList = this.authService.userList;

    let defaultList = [];
    if (listData && Array.isArray(listData) && listData.length) {
      defaultList = listData.map((obj: any) => {
        // Add 'editUser' and 'deleteUser' properties to item
        let item: any = this.BaseData.apiObjToDataObj(obj);
        if (item['editUserId'] != null) {
          item['editUser'] = this.HList.findProperty(userList, { property: 'id', value: item.editUserId }, ['name']);
        }
        if (item.deleteUserId != null) {
          item['deleteUser'] = this.HList.findProperty(userList, { property: 'id', value: item.deleteUserId }, ['name']);
        }
        return item;
      });
    }
    return defaultList;
  }

  /**
   *  getNewList() is configured differently in each service
   */
  getNewList(defaultList: any[], listData: any[]) {
    console.log('listData: ', listData);
    console.log('newList: ', defaultList);
    const newList = defaultList;
    return newList;
  }

  /**
   *  setList() sets this.list and this.filteredList using listData
   *  while setting this.list, editUser and deleteUser properties will be setTimout
   *  when the element of listData has editUserId and deleteUserId values
   *  At the end, boolean isUpdated will be returned after comparing newList and oldList
   */
  setList(listData: any[]): boolean {
    if (!this.isLoaded) {
      this.isLoaded = true;
    }
    // When this.list is actually changed from oldList, isUpdated is set to true
    let isUpdated = false;

    const defaultList = this.getDefaultList(listData);

    // Convert defaultList to newList by updating defaultList
    let newList = this.getNewList(defaultList, listData);

    // Sort newList accroding to this.sortOptions
    newList = this.HList.sort(newList, this.sortOptions);

    if (!HList.isSame(this.list, newList)) {
      // When this.lis and newList are not same
      isUpdated = true;
      this.list = newList;
      this.filteredList = newList.filter((item: any) => item.deleteUserId == null );
    }

    return isUpdated;
  }


  getList(listName: string = 'filteredList') {
    const list = this[listName];
    if (list && typeof list === 'object' && list.constructor === Array) {
      return [...list];
    }
  }

  getSortedList(listName: string = 'filteredList', sortOpts: SortOption[] = this.sortOptions ) {
    const list = this[listName];
    if (list && typeof list === 'object' && list.constructor === Array &&
      sortOpts && typeof sortOpts === 'object' && sortOpts.constructor === Array && sortOpts.length) {

      const sortedList = HList.sort(list, sortOpts);
      if (sortedList) {
        return sortedList;
      }
    }
  }

  /**
   *  emitListUpdate() makes Subject this.$listUpdate emit ListUpdate instance, listUpdate
   *  after this.fetchList()
   */
  emitListUpdate(isUpdated: any) {
    if (isUpdated && typeof isUpdated === 'boolean') {
      this.$listUpdate.next({
        isUpdated: isUpdated,
        list: this.list,
        filteredList: this.filteredList
      });
    }
  }

  fetchList(listData: any[]) {
    const isUpdated = this.setList(listData);
    this.emitListUpdate(isUpdated);
  }

  fetchListFromLocalStorage(object: string = this.object) {
    const listData = JSON.parse(localStorage.getItem(object));
    this.fetchList(listData);
  }

  /**
   *  saveListToLocalStorage() saves this.list to localStorage
   *  saveListToLocalStorage() is invoked when this.list is changed
   */
  saveListToLocalStorage(list: any[]) {
    if (list && typeof list === 'object' && list.constructor === Array) {
      const convertedList = list.map((item: any) => this.BaseData.dataObjToApiObj(item));
      localStorage.setItem(this.object, JSON.stringify(convertedList));
    }
  }

  /**
   *  getApiOpts() returns ApiOpts instance, apiOpts
   *  after setting baseParamsObj and apiObj properties to apiOpts
   */
  getApiOpts(action: string, item?: any) {
    let baseParamsObj: any = {
      object: this.object,
      action: action,
    };
    // Only when this.date is a valid Date instance, baseParamsObj.date is set
    // if (this.date && this.date instanceof Date) {
    //   // baseParamsObj.date = this.dateFormatService.formatToDbDate(this.date);
    //   baseParamsObj['date'] = this.HDate.toDBDateString(this.date)
    // }
    if (action === 'read' && this.requireDate(this.object)) {
      // If this.object requires date
      baseParamsObj['date'] = this.HDate.toDBDateString(this.paramsService.getDate());
    }

    if (action === 'duplicate') {
      baseParamsObj['date'] = this.HDate.toDBDateString(item['date']);
      baseParamsObj['insert_date'] = this.HDate.toDBDateString(item['insertDate']);
    }

    let apiOpts: ApiOpts = {
      baseParamsObj: baseParamsObj
    };
    // Only when item is a BaseData instance, apiOpts.apiObj is set
    if (item) {

      apiOpts.apiObj = this.BaseData.dataObjToApiObj(item);
    }
    return apiOpts;
  }

  /**
   *  emitApiResponse() makes Subject this.$apiResponse emit ApiResponce instance, apiResponse
   *  after receiving API response.
   *  It also hide progressbar and show snakbar message
   */
  emitApiResponse(apiResponse: ApiResponse) {
    // Emit apiResponse
    this.$apiResponse.next(apiResponse);
    // Hide progressbar
    this.uiService.hideProgressbar();
    // Show ApiResponseMessage
    this.uiService.showApiResponseMessage(apiResponse);
  }


  processApiResponse({ httpSuccess, response, apiOpts }: {
    httpSuccess: boolean,
    response: any,
    apiOpts: ApiOpts
  }) {
    let apiResponse: ApiResponse = { apiOpts: apiOpts };
    let success: boolean;

    if (httpSuccess) {
      // When http call is successful,
      success = true;

      if (!response || typeof response !== 'object') {
        success = false;
      } else if (response.rowcount === 0 &&
        (this.actionsWithZeroRowcount.indexOf(apiOpts.baseParamsObj.action) === -1 ||
        this.objectsWithZeroRowcountRead.indexOf(this.object) === -1)
      ) {
        // When response.rowcount is 0 and
        // action is not found this.actionsWithZeroRowcount and
        // object is not found this.objectsWithZeroRowcountRead
        success = false;
      }

      if (apiOpts.baseParamsObj.action === 'read') {
        // When action is 'read', invoke this.fetchList()
        // to fetch this.list and this.filteredList and emit this.$listUpdate
        this.fetchList(response.data);
      } else {
        // If action is not 'read' call this.api('read')
        // to update this.list and this.filteredList
        if (this.instantUpdateTimeoutId) {
          clearTimeout(this.instantUpdateTimeoutId);
        }
        this.instantUpdateTimeoutId = setTimeout(() => {
          this.api('read');
        }, this.instantUpdateInterval);
      }
    } else {
      // When http call is not successful,
      success = false
    }

    return {
      ...apiResponse,
      success: success,
      response: response
    };

  }

  apiToday(action: string, item?: any) {
    console.log('apiToday', item);
    let apiOpts = this.getApiOpts(action, item);
    // Reset baseParamsObj.date as today
    apiOpts.baseParamsObj['date'] = this.HDate.toDBDateString(new Date());
    let apiResponse: ApiResponse = { apiOpts: apiOpts };

    this.apiStorageService.processApi(apiOpts).subscribe(
      (res) => {
        apiResponse = this.processApiResponse({
          httpSuccess: true,
          response: res,
          apiOpts: apiOpts
        });

        this.emitApiResponse(apiResponse);
      },
      (err) => {
        apiResponse = this.processApiResponse({
          httpSuccess: false,
          response: err,
          apiOpts: apiOpts
        });

        this.emitApiResponse(apiResponse);
      }
    );
  }

  /**
   *  api() takes parameter action and optional parameter item
   *  and makes http calls through this.apiStorageService.
   *  After receiving http responses, apiResponse will be emitted
   */
  api(action: string, item?: any) {
    // console.log('api', item);
    let apiOpts = this.getApiOpts(action, item);
    let apiResponse: ApiResponse = { apiOpts: apiOpts };

    this.apiStorageService.processApi(apiOpts).subscribe(
      (res) => {
        apiResponse = this.processApiResponse({
          httpSuccess: true,
          response: res,
          apiOpts: apiOpts
        });

        this.emitApiResponse(apiResponse);
      },
      (err) => {
        apiResponse = this.processApiResponse({
          httpSuccess: false,
          response: err,
          apiOpts: apiOpts
        });

        this.emitApiResponse(apiResponse);
      }
    );
  }

  /**
   *  autoUpdateList() invokes this.api('read') continuously
   *  with this.autoUpdateInterval
   */
  autoUpdateList() {
    // If there is any previously invoked setTimout(), clear setTimeout() first
    if (this.autoUpdateTimeoutId !== null) {
      clearTimeout(this.autoUpdateTimeoutId);
    }
    // Update this.list using this.api('read')
    this.autoUpdateTimeoutId = setTimeout(() => {
      this.api('read');
      this.autoUpdateList();
    }, this.autoUpdateInterval);
  }

  getItemProperty(listName: string, { property, value }: { property: string, value: any }, props: string[]): any {
    let result = '';
    const list = this[listName];
    if (list && typeof list === 'object' && list.constructor === Array) {
      result = this.HList.findProperty(list, { property: property, value: value }, props) || '';
    }
    return result;
  }

}
