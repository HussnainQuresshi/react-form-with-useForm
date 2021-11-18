var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable no-use-before-define */
import get from "rc-util/lib/utils/get";
import set from "rc-util/lib/utils/set";
import { toArray } from "./typeUtil";
export function getNamePath(path) {
    return toArray(path);
}
export function getValue(store, namePath) {
    var value = get(store, namePath);
    return value;
}
export function setValue(store, namePath, value) {
    var newStore = set(store, namePath, value);
    return newStore;
}
export function cloneByNamePathList(store, namePathList) {
    var newStore = {};
    namePathList.forEach(function (namePath) {
        var value = getValue(store, namePath);
        newStore = setValue(newStore, namePath, value);
    });
    return newStore;
}
export function containsNamePath(namePathList, namePath) {
    return (namePathList &&
        namePathList.some(function (path) { return matchNamePath(path, namePath); }));
}
function isObject(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        Object.getPrototypeOf(obj) === Object.prototype);
}
function internalSetValues(store, values) {
    var newStore = Array.isArray(store) ? __spreadArray([], __read(store), false) : __assign({}, store);
    if (!values) {
        return newStore;
    }
    Object.keys(values).forEach(function (key) {
        var prevValue = newStore[key];
        var value = values[key];
        var recursive = isObject(prevValue) && isObject(value);
        newStore[key] = recursive
            ? internalSetValues(prevValue, value || {})
            : value;
    });
    return newStore;
}
export function setValues(store) {
    var restValues = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restValues[_i - 1] = arguments[_i];
    }
    return restValues.reduce(function (current, newStore) { return internalSetValues(current, newStore); }, store);
}
export function matchNamePath(namePath, changedNamePath) {
    if (!namePath ||
        !changedNamePath ||
        namePath.length !== changedNamePath.length) {
        return false;
    }
    return namePath.every(function (nameUnit, i) { return changedNamePath[i] === nameUnit; });
}
export function isSimilar(source, target) {
    if (source === target) {
        return true;
    }
    if ((!source && target) || (source && !target)) {
        return false;
    }
    if (!source ||
        !target ||
        typeof source !== "object" ||
        typeof target !== "object") {
        return false;
    }
    var sourceKeys = Object.keys(source);
    var targetKeys = Object.keys(target);
    var keys = new Set(__spreadArray(__spreadArray([], __read(sourceKeys), false), __read(targetKeys), false));
    return __spreadArray([], __read(keys), false).every(function (key) {
        var sourceValue = source[key];
        var targetValue = target[key];
        if (typeof sourceValue === "function" &&
            typeof targetValue === "function") {
            return true;
        }
        return sourceValue === targetValue;
    });
}
export function defaultGetValueFromEvent(valuePropName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var event = args[0];
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
export function move(array, moveIndex, toIndex) {
    var length = array.length;
    if (moveIndex < 0 ||
        moveIndex >= length ||
        toIndex < 0 ||
        toIndex >= length) {
        return array;
    }
    var item = array[moveIndex];
    var diff = moveIndex - toIndex;
    if (diff > 0) {
        // move left
        return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(array.slice(0, toIndex)), false), [
            item
        ], false), __read(array.slice(toIndex, moveIndex)), false), __read(array.slice(moveIndex + 1, length)), false);
    }
    if (diff < 0) {
        // move right
        return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(array.slice(0, moveIndex)), false), __read(array.slice(moveIndex + 1, toIndex + 1)), false), [
            item
        ], false), __read(array.slice(toIndex + 1, length)), false);
    }
    return array;
}
