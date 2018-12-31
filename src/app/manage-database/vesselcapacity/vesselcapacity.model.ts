import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  VesselcapacityApiObj is the interface of returning objects from API
 *  VesselcapacityApiObj interface uses underscore case for its property names
*/
export interface VesselcapacityApiObj extends BaseApiObj {
  'vessel_capacity'?: string | null;
}

/**
 *  Vesselcapacity is the base interface for the objects used in the front-end
 *  Vesselcapacity interface uses underscore case for its property names
*/
export interface Vesselcapacity extends BaseDataObj {
  vesselCapacity?: string | null;
}
