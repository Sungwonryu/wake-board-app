import { Injectable } from '@angular/core';
import { BaseDataService } from '../../api-storage/base-data.service';

import { ApiStorageService } from '../../api-storage/api-storage.service';
import { AuthService } from '../../auth/auth.service';
import { ParamsService } from '../../shared/services/params.service';
import { UIService } from '../../shared/services/ui.service';

@Injectable()
export class VesselnumberService extends BaseDataService {
  object = 'vessel_numbers';
  sortOrder = [
    { property: 'vesselNumber', isDescending: false }
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
