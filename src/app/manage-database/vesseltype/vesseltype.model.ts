import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  VesseltypeApiObj is the interface of returning objects from API
 *  VesseltypeApiObj interface uses underscore case for its property names
*/
export interface VesseltypeApiObj extends BaseApiObj {
  'vessel_type'?: string | null;
}

/**
 *  Vesseltype is the base interface for the objects used in the front-end
 *  Vesseltype interface uses underscore case for its property names
*/
export interface Vesseltype extends BaseDataObj {
  vesselType?: string | null;
}
