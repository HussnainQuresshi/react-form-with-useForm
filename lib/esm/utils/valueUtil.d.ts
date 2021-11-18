export declare function getNamePath(path: any): any[];
export declare function getValue(store: any, namePath: any): any;
export declare function setValue(store: any, namePath: any, value: any): any;
export declare function cloneByNamePathList(store: any, namePathList: any): {};
export declare function containsNamePath(namePathList: any, namePath: any): any;
export declare function setValues(store: any, ...restValues: any): any;
export declare function matchNamePath(namePath: any, changedNamePath: any): any;
export declare function isSimilar(source: any, target: any): boolean;
export declare function defaultGetValueFromEvent(valuePropName: any, ...args: any): any;
/**
 * Moves an array item from one position in an array to another.
 *
 * Notehis is a pure function so a new array will be returned, instead
 * of altering the array argument.
 *
 * @param array         Array in which to move an item.         (required)
 * @param moveIndex     The index of the item to move.          (required)
 * @param toIndex       The index to move item at moveIndex to. (required)
 */
export declare function move(array: any[], moveIndex: any, toIndex: any): any[];
