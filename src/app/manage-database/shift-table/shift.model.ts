import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  ShiftApiObj is the interface of returning objects from API
 *  ShiftApiObj interface uses underscore case for its property names
*/
export interface ShiftApiObj extends BaseApiObj {
  'shift'?: string | null;
  'route'?: string | null;
  'first_departure'?: string | null;
  'call_time'?: string | null;
  'location'?: string | null;
}

/**
 *  Shift is the base interface for the objects used in the front-end
 *  Shift interface uses underscore case for its property names
*/
export interface Shift extends BaseDataObj {
  shift?: string | null;
  route?: string | null;
  firstDeparture?: Date | null;
  callTime?: Date | null;
  location?: string | null;
}
