export class HArray {
  static includes(list: any, item: any) {
    let isIncluded = false;
    if (list && list.constructor === Array) {
      // When list is an array
      isIncluded = list.includes(item);
    }
    return isIncluded;
  }
}
