import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs' ;

// import { ApiOpts, ApiResponse, BaseParamsObj, ListUpdate } from '../../api-storage/api-storage.model';
// import { User, UserApiObj, UserOpts } from '../../auth/user.model';
// import { Vesseltype, VesseltypeApiObj, VesseltypeOpts } from '../vesseltype/vesseltype.model';

import { BaseDataService } from '../../api-storage/base-data.service';
import { ApiStorageService } from '../../api-storage/api-storage.service';
import { AuthService } from '../../auth/auth.service';
import { ParamsService } from '../../shared/services/params.service';
import { UIService } from '../../shared/services/ui.service';


@Injectable()
export class VesselService extends BaseDataService {
  object = 'vessels';
  sortOrder = [
    { property: 'vesselNo', isDescending: false }
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
  }

}
