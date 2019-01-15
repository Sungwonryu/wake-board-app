// import { BaseDataApiObj, BaseDataOpts, BaseData } from '../api-storage/base-data.model';
//
// /**
//  *  MessageApiObj is the interface of returning objects from API
//  *  MessageApiObj interface uses underscore case for its property names
// */
// export interface MessageApiObj extends BaseDataApiObj {
//   'message'?: string | null;
//   'symbol'?: string | null;
//   'abbreviation'?: string | null;
// }
//
// /**
//  *  MessageOpts is the base interface for the objects used for setting Message calss instance
//  *  MessageOpts interface uses underscore case for its property names
// */
// export interface MessageOpts extends BaseDataOpts {
//   message?: string | null;
//   symbol?: string | null;
//   abbreviation?: string | null;
// }
//
// /**
//  *  Message is the base class used in the front-end
//  *  Message class uses camel case for its property names
// */
// export class Message extends BaseData {
//   message?: string | null; // message can not be null
//   symbol?: string | null;
//   abbreviation?: string | null;
//
//   constructor(obj?: any) {
//     super();
//     if (obj && typeof obj === 'object') {
//       const opts: MessageOpts = this._toOpts(obj);
//       this.set(opts);
//     }
//   }
//
//   /**
//    *  set() sets the properties of Message class instance
//    *  by passing an object with same properties as BaseDate class
//   */
//   set(opts: MessageOpts) {
//     // super.set() sets BaseData class properties
//     super.set(opts);
//
//     if (typeof opts.message === 'string' || opts.message === null) this.message = opts.message;
//     if (typeof opts.symbol === 'string' || opts.symbol === null) this.symbol = opts.symbol;
//     if (typeof opts.abbreviation === 'string' || opts.abbreviation === null) this.abbreviation = opts.abbreviation;
//   }
//
//   /**
//    *  conevrtToOpts() returns MessageOpts interface object, opts
//    *  opts has camel case property names
//   */
//   _toOpts(obj: MessageApiObj) {
//     let opts: MessageOpts = super._toOpts(obj);
//
//     if (typeof obj['message'] === 'string' || obj['message'] === null) opts.message = obj['message'];
//     if (typeof obj['symbol'] === 'string' || obj['symbol'] === null) opts.symbol = obj['symbol'];
//     if (typeof obj['abbreviation'] === 'string' || obj['abbreviation'] === null) opts.abbreviation = obj['abbreviation'];
//
//     return opts;
//   }
//
// } // end of Message class

import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  MessageApiObj is the interface of returning objects from API
 *  MessageApiObj interface uses underscore case for its property names
*/
export interface MessageApiObj extends BaseApiObj {
  'message'?: string | null;
  'symbol'?: string | null;
  'abbreviation'?: string | null;
}

/**
 *  Message is the base interface for the objects used in the front-end
 *  Message interface uses underscore case for its property names
*/
export interface Message extends BaseDataObj {
  message?: string | null;
  symbol?: string | null;
  abbreviation?: string | null;
}
