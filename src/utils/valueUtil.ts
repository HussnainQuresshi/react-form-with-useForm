/* eslint-disable no-use-before-define */
import get from "rc-util/lib/utils/get";
import set from "rc-util/lib/utils/set";
import { toArray } from "./typeUtil";

export function getNamePath(path: any) {
  return toArray(path);
}

export function getValue(store: any, namePath: any) {
  const value = get(store, namePath);
  return value;
}

export function setValue(store: any, namePath: any, value: any) {
  const newStore = set(store, namePath, value);
  return newStore;
}

export function cloneByNamePathList(store: any, namePathList: any) {
  let newStore = {};
  namePathList.forEach((namePath: any) => {
    const value = getValue(store, namePath);
    newStore = setValue(newStore, namePath, value);
  });

  return newStore;
}

export function containsNamePath(namePathList: any, namePath: any) {
  return (
    namePathList &&
    namePathList.some((path: any) => matchNamePath(path, namePath))
  );
}

function isObject(obj: any) {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
}

function internalSetValues(store: any, values: any) {
  const newStore = Array.isArray(store) ? [...store] : { ...store };

  if (!values) {
    return newStore;
  }

  Object.keys(values).forEach((key) => {
    const prevValue = newStore[key];
    const value = values[key];
    const recursive = isObject(prevValue) && isObject(value);
    newStore[key] = recursive
      ? internalSetValues(prevValue, value || {})
      : value;
  });

  return newStore;
}

export function setValues(store: any, ...restValues: any) {
  return restValues.reduce(
    (current: any, newStore: any) => internalSetValues(current, newStore),
    store,
  );
}

export function matchNamePath(namePath: any, changedNamePath: any) {
  if (
    !namePath ||
    !changedNamePath ||
    namePath.length !== changedNamePath.length
  ) {
    return false;
  }
  return namePath.every(
    (nameUnit: any, i: any) => changedNamePath[i] === nameUnit,
  );
}

export function isSimilar(source: any, target: any) {
  if (source === target) {
    return true;
  }

  if ((!source && target) || (source && !target)) {
    return false;
  }

  if (
    !source ||
    !target ||
    typeof source !== "object" ||
    typeof target !== "object"
  ) {
    return false;
  }

  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);
  const keys = new Set([...sourceKeys, ...targetKeys]);

  return [...keys].every((key) => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      typeof sourceValue === "function" &&
      typeof targetValue === "function"
    ) {
      return true;
    }
    return sourceValue === targetValue;
  });
}

export function defaultGetValueFromEvent(valuePropName: any, ...args: any) {
  const event = args[0];
  if (event && event.target && valuePropName in event.target) {
    return event.target[valuePropName];
  }

  return event;
}

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
export function move(array: any[], moveIndex: any, toIndex: any) {
  const { length } = array;
  if (
    moveIndex < 0 ||
    moveIndex >= length ||
    toIndex < 0 ||
    toIndex >= length
  ) {
    return array;
  }
  const item = array[moveIndex];
  const diff = moveIndex - toIndex;

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length),
    ];
  }
  if (diff < 0) {
    // move right
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, toIndex + 1),
      item,
      ...array.slice(toIndex + 1, length),
    ];
  }
  return array;
}
