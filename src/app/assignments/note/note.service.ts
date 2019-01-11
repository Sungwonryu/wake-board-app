import { Injectable } from '@angular/core';
import { BaseDataService } from '../../api-storage/base-data.service';

import { ApiStorageService } from '../../api-storage/api-storage.service';
import { AuthService } from '../../auth/auth.service';
import { ParamsService } from '../../shared/services/params.service';
import { UIService } from '../../shared/services/ui.service';

@Injectable()
export class NoteService extends BaseDataService {
  object = 'notes';
  sortOrder = [
    { property: 'expirationDate', isDescending: false }
  ];

  priorityList = [
    { id: '1', text: 'Critical' },
    { id: '2', text: 'Low' }
  ];

  durationList = [
    { id: '1', text: 'One Day', days: 1 },
    { id: '2', text: 'One Week', days: 7 },
    { id: '3', text: 'Ongoing', days: 0 }
  ];

  colorList = [
    { id: '1', text: 'White - Low', colorCode: '#FFFFFF' },
    { id: '2', text: 'Purple - Low', colorCode: '#D1C7DF' },
    { id: '3', text: 'Orange - Low' , colorCode: '#FBE3CF' },
    { id: '4', text: 'Red - Critical', colorCode: '#FF585C' }
  ];

  constructor(
    protected apiStorageService: ApiStorageService,
    protected authService: AuthService,
    protected paramsService: ParamsService,
    protected uiService: UIService,
  ) {

    super(
      apiStorageService,
      authService,
      paramsService,
      uiService
    );
    this.init();
  }

  /**
   *  getNewList() is configured differently in each service
   */
  getNewList(defaultList: any[], listData: any[]) {
    console.log(`${this.object} - listData: `, listData);
    console.log(`${this.object} - newList: `, defaultList);
    const newList = defaultList;
    return newList;
  }

}
