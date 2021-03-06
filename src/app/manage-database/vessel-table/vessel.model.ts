import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  VesselApiObj is the interface of returning objects from API
 *  VesselApiObj interface uses underscore case for its property names
*/
export interface VesselApiObj extends BaseApiObj {
  'vessel_number'?: string | null;
  'vessel_name'?: string | null;
  'vessel_capacity'?: string | null;
  'vessel_type'?: string | null;
}

/**
 *  Vessel is the base interface for the objects used in the front-end
 *  Vessel interface uses underscore case for its property names
*/
export interface Vessel extends BaseDataObj {
  vesselNumber?: string | null;
  vesselName?: string | null;
  vesselCapacity?: string | null;
  vesselType?: string | null;
}
