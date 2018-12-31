import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  RouteApiObj is the interface of returning objects from API
 *  RouteApiObj interface uses underscore case for its property names
*/
export interface RouteApiObj extends BaseApiObj {
  'route'?: string | null;
}

/**
 *  Route is the base interface for the objects used in the front-end
 *  Route interface uses underscore case for its property names
*/
export interface Route extends BaseDataObj {
  route?: string | null;
}
