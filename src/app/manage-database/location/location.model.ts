import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  LocationApiObj is the interface of returning objects from API
 *  LocationApiObj interface uses underscore case for its property names
*/
export interface LocationApiObj extends BaseApiObj {
  'location'?: string | null;
}

/**
 *  Location is the base interface for the objects used in the front-end
 *  Location interface uses underscore case for its property names
*/
export interface Location extends BaseDataObj {
  location?: string | null;
}
