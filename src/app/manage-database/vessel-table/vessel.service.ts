import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs' ;

// import { ApiOpts, ApiResponse, BaseParamsObj, ListUpdate } from '../../api-storage/api-storage.model';
// import { User, UserApiObj, UserOpts } from '../../auth/user.model';
// import { Vesseltype, VesseltypeApiObj, VesseltypeOpts } from '../vesseltype/vesseltype.model';
import { HString } from '../../shared/lib/h-string';
import { ApiStorageService } from '../../api-storage/api-storage.service';
import { BaseDataService } from '../../api-storage/base-data.service';
import { AuthService } from '../../auth/auth.service';
import { ParamsService } from '../../shared/services/params.service';
import { UIService } from '../../shared/services/ui.service';


@Injectable()
export class VesselService extends BaseDataService {

  HString = HString;

  object = 'vessels';
  sortOrder = [
    { property: 'Vesselnumber', isDescending: false }
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

  getVesselText(item: any): string {
    let str = '';
    if (item && typeof item === 'object') {
      if (item.vesselNumber) {
        str += item.vesselNumber;
      }
      if (item.vesselNumber && item.vesselName) {
        str += ' - ';
      }
      if (item.vesselName) {
        str += item.vesselNaem;
      }
    }
    return str;
  }

  getAutocompleteList() {
    const AutocompleteList = this.getList().map((item: any) => {
      let newItem;
      if (item && typeof item === 'object') {
        newItem = {};
        for (let prop in item) {
          if (item.hasOwnProperty(prop)) {
            newItem[prop] = item[prop];
          }
        }
        newItem.vessel = this.HString.toDefaultString(item.vesselNumber);
        if (item.vesselNumber && item.vesselName) {
          newItem.vessel += ' - ';
        }
        if (item.vesselName) {
          newItem.vessel += this.HString.toDefaultString(item.vesselName);
        }
      }
      return newItem;
    });
    return AutocompleteList;
  }

  findAutocompleteItem(id: string) {
    const autocompletList = this.getAutocompleteList();
    let matchedItem = autocompletList.find(item => {
      if (item && typeof item === 'object') {
        if (item.id === id) {
          return item;
        }
      }
    });
    return matchedItem;
  }

}
