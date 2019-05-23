// import { Injectable } from '@angular/core';
// import { BaseDataService } from '../../api-storage/base-data.service';
//
// import { ApiStorageService } from '../../api-storage/api-storage.service';
// import { AuthService } from '../../auth/auth.service';
// import { ParamsService } from '../../shared/services/params.service';
// import { UIService } from '../../shared/services/ui.service';
// import { VesselService } from '../../manage-database/vessel-table/vessel.service';
//
// @Injectable()
// export class SlipassignmentService extends BaseDataService {
//   object = 'slip_assignments';
//   sortOrder = [
//     { property: 'slip', isDescending: false }
//   ];
//
//   availabilityList = [
//     { value: '1', text: 'Available' },
//     { value: '0', text: 'Unavailable' }
//   ];
//
//   slipList = [{ slip: '1' }, { slip: '2' }, { slip: '3' }, { slip: '4' }, { slip: '5' }, { slip: '6' }, { slip: '7' }, { slip: '8' }, { slip: '9' }, { slip: '10' }];
//
//   constructor(
//     protected apiStorageService: ApiStorageService,
//     protected authService: AuthService,
//     protected paramsService: ParamsService,
//     protected uiService: UIService,
//     protected vesselService: VesselService
//   ) {
//
//     super(
//       apiStorageService,
//       authService,
//       paramsService,
//       uiService
//     );
//     this.init();
//   }
//
//   /**
//    *  getNewList() is configured differently in each service
//    */
//   getNewList(defaultList: any[], listData: any[]) {
//     const newList = defaultList;
//     let item;
//     for (let i = 0; i < newList.length; i++) {
//       item = newList[i];
//       let vessel1 = '';
//       let vessel2 = '';
//       let vessel3 = '';
//       if (item && typeof item === 'object' && typeof item.vessel1Id === 'string') {
//         vessel1 = this.vesselService.getVesselName(item.vessel1Id);
//       }
//       item.vessel1 = vessel1;
//       if (item && typeof item === 'object' && typeof item.vessel2Id === 'string') {
//         vessel2 = this.vesselService.getVesselName(item.vessel2Id);
//       }
//       item.vessel2 = vessel2;
//       if (item && typeof item === 'object' && typeof item.vessel3Id === 'string') {
//         vessel3 = this.vesselService.getVesselName(item.vessel3Id);
//       }
//       item.vessel3 = vessel3;
//     }
//     return newList;
//   }
//
// }


import { Injectable } from '@angular/core';
import { BaseDataService } from '../../api-storage/base-data.service';

import { ApiStorageService } from '../../api-storage/api-storage.service';
import { AuthService } from '../../auth/auth.service';
import { ParamsService } from '../../shared/services/params.service';
import { UIService } from '../../shared/services/ui.service';
import { VesselService } from '../../manage-database/vessel-table/vessel.service';

@Injectable()
export class SlipassignmentService extends BaseDataService {
  object = 'slip_assignments';
  sortOrder = [
    { property: 'slip', isDescending: false }
  ];

  availabilityList = [
    { value: '1', text: 'Available' },
    { value: '0', text: 'Unavailable' }
  ];

  slipList = [{ slip: '1' }, { slip: '2' }, { slip: '3' }, { slip: '4' }, { slip: '5' }, { slip: '6' }, { slip: '7' }, { slip: '8' }, { slip: '9' }, { slip: '10' },
              { slip: '11' }, { slip: '12' }, { slip: '13' }, { slip: '14' }, { slip: '15' }, { slip: '16' }, { slip: '17' }, { slip: '18' }, { slip: '19' }, { slip: '20' },
              { slip: '21' }, { slip: '22' }, { slip: '23' }, { slip: '24' }, { slip: '25' }, { slip: '26' }, { slip: '27' }, { slip: '28' }, { slip: '29' }, { slip: '30' }];

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
