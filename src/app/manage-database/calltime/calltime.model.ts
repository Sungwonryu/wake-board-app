import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  CalltimeApiObj is the interface of returning objects from API
 *  CalltimeApiObj interface uses underscore case for its property names
*/
export interface CalltimeApiObj extends BaseApiObj {
  'call_time'?: string | null;
}

/**
 *  Calltime is the base interface for the objects used in the front-end
 *  Calltime interface uses underscore case for its property names
*/
export interface Calltime extends BaseDataObj {
  callTime?: string | null;
}
