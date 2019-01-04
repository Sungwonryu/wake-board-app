import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  ShiftnameApiObj is the interface of returning objects from API
 *  ShiftnameApiObj interface uses underscore case for its property names
*/
export interface ShiftnameApiObj extends BaseApiObj {
  'shift'?: string | null;
}

/**
 *  Shiftname is the base interface for the objects used in the front-end
 *  Shiftname interface uses underscore case for its property names
*/
export interface Shiftname extends BaseDataObj {
  shift?: string | null;
}
