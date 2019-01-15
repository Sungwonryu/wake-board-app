import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { DataLoad } from './data-load.model';

const dataLoadList: DataLoad[] = [
  { isReady: false, object: 'vessel_numbers' },
  { isReady: false, object: 'vessel_names' },
  { isReady: false, object: 'vessel_types' },
  { isReady: false, object: 'vessel_capacities' },
  { isReady: false, object: 'messages' },
  { isReady: false, object: 'shift_names' },
  { isReady: false, object: 'call_times' },
  { isReady: false, object: 'locations' },
  { isReady: false, object: 'employees' },
  { isReady: false, object: 'jobs' },
  { isReady: false, object: 'routes' },
  { isReady: false, object: 'vessels' },
  { isReady: false, object: 'shifts' },
  { isReady: false, object: 'crew_members' },
  { isReady: false, object: 'crew_shifts' }
];

const url = environment.urls.api;

@Injectable()
export class DataLoadService {
  constructor(
    private httpClient: HttpClient
  ) {  }

  loadAll(): Promise<any> {
    let promiseList: any[] = [];

    if (url && typeof url === 'string') {
      promiseList = dataLoadList.map((dataLoad: DataLoad) => {
        return this.storeDataToLocalStorage(dataLoad);
      });
    }

    return new Promise((resolve) => {
      Promise.all(promiseList).then(() => {
        console.log('Preloader() finishes all promises - all data are stored in localStorage');
        resolve();
      });
    });

  }

  storeDataToLocalStorage(dataLoad: DataLoad): Promise<any> {
    const object = dataLoad.object;
    const paramsObj = { object: object, action: 'read' };
    const params = new HttpParams({ fromObject: paramsObj });

    // const promise = new Promise((resolve, reject) => {
    const promise = new Promise((resolve) => {
      this.httpClient
        .get(url, { params: params })
        .subscribe(
          (res: any) => {
            if (res && typeof res === 'object' && res.rowcount > 0) {
              // When res is an object with a positive rowcount
              const dataStr = JSON.stringify(res.data);
              localStorage.setItem(object, dataStr);

            }
            dataLoad.isReady = true;
            resolve();
          },
          (err) => {
            dataLoad.isReady = true;
            console.log(`Error, API data retrieval for the object - ${object} failed!, error: `, err);
            resolve();
          }
        )
    });
    return promise;
  }
}
