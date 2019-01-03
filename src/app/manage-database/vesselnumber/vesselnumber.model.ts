import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  VesselnumberApiObj is the interface of returning objects from API
 *  VesselnumberApiObj interface uses underscore case for its property names
*/
export interface VesselnumberApiObj extends BaseApiObj {
  // 'vessel_number'?: string | null;
  'vessel_no'?: string | null;
}

/**
 *  Vesselnumber is the base interface for the objects used in the front-end
 *  Vesselnumber interface uses underscore case for its property names
*/
export interface Vesselnumber extends BaseDataObj {
  // vesselNumber?: string | null;
  vesselNo?: string | null;
}
