import { Injectable } from '@angular/core';
import { BaseDataService } from '../../api-storage/base-data.service';

import { ApiStorageService } from '../../api-storage/api-storage.service';
import { AuthService } from '../../auth/auth.service';
import { ParamsService } from '../../shared/services/params.service';
import { UIService } from '../../shared/services/ui.service';
import { VesselService } from '../../manage-database/vessel-table/vessel.service';

@Injectable()
export class VesselassignmentService extends BaseDataService {
  object = 'vessel_assignments';
  sortOrder = [
    { property: 'callTime', isDescending: false },
    { property: 'firstDeparture', isDescending: false }
  ];

  constructor(
    protected apiStorageService: ApiStorageService,
    protected authService: AuthService,
    protected paramsService: ParamsService,
    protected uiService: UIService,
    protected vesselService: VesselService
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
    const newList = defaultList;
    let item;
    for (let i = 0; i < newList.length; i++) {
      item = newList[i];
      let vessel = '';
      if (item && typeof item === 'object' && typeof item.vesselId === 'string') {
        vessel = this.vesselService.getVesselName(item.vesselId);
      }
      item.vessel = vessel;
    }
    return newList;
  }
}
