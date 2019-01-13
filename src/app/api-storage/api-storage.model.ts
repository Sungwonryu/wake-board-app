/**
 *  ParamsObj is the interface for API query paramsObj
*/
export interface BaseParamsObj {
  'action'?: string;
  'object'?: string;
  'user_id'?: string;
  'date'?: string;
}

/*  ApiOpts is the interface for the parameter of apiStorageService
 *  ApiOpts interface uses camel case for its property names
 *  except apiObj whose properties uses snake case
*/
export interface ApiOpts {
  url?: string,
  httpMethod?: string;
  baseParamsObj?: BaseParamsObj;
  apiObj?: any;
}

/**
 *  ApiResponse is the interface for the returning objects from apiStorageService
*/
export interface ApiResponse {
  apiOpts?: ApiOpts;
  success?: boolean;
  error?: any;
  response?: any;
}

/**
 *  ListUpdate is the interface for the returning objects from $listUpdate Subject
*/
export interface ListUpdate {
  isUpdated?: boolean,
  list?: any;
  filteredList?: any;
}
