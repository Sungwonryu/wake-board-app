import { BaseApiObj, BaseDataObj } from '../api-storage/base-data';

export interface AuthData {
  email?: string;
  password?: string;
  name?: string;
}

/**
 *  UserApiObj is the base interface of returning objects from API
 *  UserApiObj interface uses snake case for its property names
*/
export interface UserApiObj extends BaseApiObj {
  'name'?: string | null;
  'email'?: string | null;
  'password'?: string | null;
  'expiration'?: number | null;
}

/**
 *  UserOpts is the base interface for the objects used for setting User class instance
 *  UserOpts interface uses snake case for its property names
*/
export interface User extends BaseDataObj {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  expiration?: number | null;
}
