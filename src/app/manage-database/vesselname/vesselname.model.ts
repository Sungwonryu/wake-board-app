import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  VesselnameApiObj is the interface of returning objects from API
 *  VesselnameApiObj interface uses underscore case for its property names
*/
export interface VesselnameApiObj extends BaseApiObj {
  'vessel_name'?: string | null;
}

/**
 *  Vesselname is the base interface for the objects used in the front-end
 *  Vesselname interface uses underscore case for its property names
*/
export interface Vesselname extends BaseDataObj {
  vesselName?: string | null;
}
