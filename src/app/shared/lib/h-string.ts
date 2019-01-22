export class HString {
  /**
   *  camelToSnake() converts from a camel case string such as 'mySnakecaseWord'
   *  to a snake case string such as 'my_snakecase_word'
   *  and return the snake case string
  */
  static camelToSnakeCase(str: any) {
    if (typeof str === 'string') {
      const convertedStr = str.replace(/([A-Z])/g, ' $1')
        .split(' ')
        .join('_')
        .toLowerCase();
      return convertedStr;
    }
  }

  /**
   *  snakeToCamel() converts from a snake case string such as 'my_snakecase_word'
   *  to a camel case string such as 'mySnakecaseWord'
   *  and return the camel case string
  */
  static snakeToCamelCase(str: any) {
    if (typeof str === 'string') {
      let convertedStr = str;
      if (str.includes('_')) {
        convertedStr = str.replace(/(\_\w)/g, (substr: string) => {
          return substr[1].toUpperCase();
        });
      }
      return convertedStr;
    }
  }

  /*
   *  truncate() set substr as the part of string from the start to maxLength indexes
   *  And if a proper splitString is given, set string as the part of substr
   *  from the start to the right before the last splitString
   *  And if a proper endString is given, concatenate the endString to the string
   *  return the processed string
   */
  static truncate({ string, maxLength, endString = '', splitString = '' }: {
    string?: any,
    maxLength?: number,
    endString?: string,
    splitString?: string
  }): string {
    if (typeof string !== 'string' || string.length === 0) {
      // When string is not a string or string is '', return ''
      return '';
    } else {
      // When string is a non zero length string
      if (typeof maxLength !== 'number' || maxLength < 0) {
        // When maxLength is not 0 or negative number, return string
        return string;
      }

      maxLength = Math.floor(maxLength);
      if (string.length > maxLength) {
        // When string.length is greater than maxLength
        // set substr as the part of string between the start and maxLength indexes
        let substr = string.substring(0, maxLength);

        if (splitString && typeof splitString === 'string') {
          // When splitString is non zero length string,
          // find splitIndex where the last splitString starts
          let splitIndex = substr.lastIndexOf(splitString);
          if (splitIndex !== -1) {
            // When splitIndex is not -1,
            // set string as the part of substr between the start and splitIndex indexes
            string = substr.substring(0, splitIndex);
          }
        }
        if (endString && typeof endString === 'string') {
          // When end string is non zero length string, concatenate endStrgin to string
          string = string + endString;
        }
      }
      // When string is not longer than maxLength, return the original string
      // Otherwise return the processed string
      return string;
    }
  }

  /*
   *  replaceSubstring() replaces the first part same as substring in string
   *  to newSubstring
   */
  static replaceSubstring({ string, substring, newSubstring }: {
    string?: any,
    substring?: string,
    newSubstring?: string
  }): string {
    if (typeof string !== 'string' || string.length === 0) {
      // When string is not a string or string is '', return ''
      return '';
    } else {
      // When string is a non zero length string
      if (substring && typeof substring === 'string' && typeof newSubstring === 'string') {
        // When substring is a non zero length string and newSubstring is a string
        // replace the substrings in string to newSubstring
        string = string.replace(substring, newSubstring);
      }
      return string;
    }
  }

  /*
   *  replaceAllSubstring() replaces all parts same as substring in string
   *  to newSubstring
   */
  static replaceAllSubstring({ string, substring, newSubstring }: {
    string?: any,
    substring?: string,
    newSubstring?: string
  }): string {
    if (typeof string !== 'string' || string.length === 0) {
      // When string is not a string or string is '', return ''
      return '';
    } else {
      // When string is a non zero length string
      if (substring && typeof substring === 'string' && typeof newSubstring === 'string') {
        // When substring is a non zero length string and newSubstring is a string
        // replace the substrings in string to newSubstring
        const regex = new RegExp('/' + substring + '/', 'g');
        string = string.replace(regex, newSubstring);
      }
      return string;
    }
  }

  /*
   *  toDefaultString() returns the defaultStr
   *  if str is not a string such as undefined and null or ''
   */
  static toDefaultString(str: any, defaultStr: string = ''): string {
    if (str && typeof str === 'string') {
      return str;
    } else {
      return defaultStr;
    }
  }

  static shortenFullName(fullName: any) {
    let shortenedName = '';
    if (fullName && typeof fullName === 'string') {
      const names = HString.toDefaultString(fullName).split(',');
      const lastName = HString.toDefaultString(name[0]).trim();
      const firstMiddleName = HString.toDefaultString(names[1]).trim();
      let firstName = firstMiddleName;
      const index = firstMiddleName.lastIndexOf(' ');
      if (index !== -1) {
        firstName = firstMiddleName.substring(0, index);
      }
      shortenedName = firstName;
      if (lastName[0]) {
        shortenedName = firstName + ' ' + lastName[0].toUpperCase() + '.';
      }
    }
    return shortenedName;
  }
}
