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
import { setValues, getValue } from "./utils/valueUtil";
import * as React from "react";
var FormStore = /** @class */ (function () {
    function FormStore() {
        var _this = this;
        this.store = {};
        this.errors = {};
        this.rules = {};
        this.fieldEntities = [];
        this.initialValues = {};
        this.callbacks = {};
        this.getFieldValue = function (name) { return _this.store[name]; };
        this.getFieldsValue = function () { return _this.store; };
        this.getFieldRules = function (name) { var _a; return (_a = _this.rules[name]) !== null && _a !== void 0 ? _a : []; };
        this.getFieldsErrors = function () { return _this.errors; };
        this.getFieldError = function (name) { var _a, _b; return ((_b = (_a = _this.errors) === null || _a === void 0 ? void 0 : _a[name]) === null || _b === void 0 ? void 0 : _b.message) || ""; };
        this.getFieldEntities = function () { return _this.fieldEntities; };
        this.validateField = function (_, __) {
            var _a;
            var rules = _this.getFieldRules(_);
            var value = __;
            var name = _;
            if (typeof value === "object" || typeof value === "boolean") {
                value = value.value ? value.value : value || false;
            }
            else
                value = value === null || value === void 0 ? void 0 : value.trim();
            var errors = [];
            rules.forEach(function (rule) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var error = {};
                switch (Object.keys(rule).filter(function (___) { return ___ !== "message"; })[0]) {
                    case "required":
                        if (rule.required) {
                            error.hasError = !value;
                            error.message = error.hasError
                                ? (_a = rule.message) !== null && _a !== void 0 ? _a : "".concat(name, " is required")
                                : "";
                        }
                        break;
                    case "min":
                        if (rule.min)
                            if (Number.isNaN(value))
                                error.hasError = value.length < rule.min;
                            else
                                error.hasError = value < rule.min;
                        error.message = error.hasError
                            ? (_b = rule.message) !== null && _b !== void 0 ? _b : "value must be grater then ".concat(rule.min)
                            : "";
                        break;
                    case "max":
                        if (rule.max)
                            if (Number.isNaN(value)) {
                                error.hasError = value.length > rule.max;
                            }
                            else {
                                error.hasError = value > rule.max;
                            }
                        error.message = error.hasError
                            ? (_c = rule.message) !== null && _c !== void 0 ? _c : "value must be less then ".concat(rule.max)
                            : "";
                        break;
                    case "email":
                        if (rule.email) {
                            error.hasError =
                                !/^\w+([\\+.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/i.test(value);
                            error.message = error.hasError
                                ? (_d = rule.message) !== null && _d !== void 0 ? _d : "enter a valid email"
                                : "";
                        }
                        break;
                    case "password":
                        if (rule.password) {
                            error.hasError = !(/(?=.*[a-z])/.test(value) &&
                                /(?=.*[A-Z])/.test(value) &&
                                (value === null || value === void 0 ? void 0 : value.length) >= 8 &&
                                /(?=.*\d)/.test(value));
                            error.message = error.hasError
                                ? (_e = rule.message) !== null && _e !== void 0 ? _e : "Password must be 8 char long with 1 number and 1 capital and small alphabet"
                                : "";
                        }
                        break;
                    case "pattern":
                        if (rule.pattern && typeof rule.pattern === "object")
                            error.hasError = !rule.pattern.test(value);
                        error.message = error.hasError
                            ? (_f = rule.message) !== null && _f !== void 0 ? _f : "enter a valid email"
                            : "";
                        break;
                    case "transform":
                        if (typeof rule.transform === "function")
                            error.hasError = (_g = rule === null || rule === void 0 ? void 0 : rule.transform) === null || _g === void 0 ? void 0 : _g.call(rule, value);
                        error.message = error.hasError
                            ? (_h = rule.message) !== null && _h !== void 0 ? _h : "this value does not satisfy the transform condition"
                            : "";
                        break;
                    default:
                        break;
                }
                errors.push(error);
            });
            var _b = __read(errors.filter(function (_a) {
                var hasError = _a.hasError;
                return hasError;
            }), 1), sinlgeError = _b[0];
            if (value === "" || value === null || value === undefined) {
                var _c = __read(rules.filter(function (r) { return r === null || r === void 0 ? void 0 : r.required; }), 1), isRequired = _c[0];
                if (!isRequired) {
                    sinlgeError = { hasError: false, message: "" };
                }
            }
            _this.setFieldsError((_a = {}, _a[name] = sinlgeError, _a));
            return errors;
        };
        this.notifyObservers = function (prevStore) {
            _this.getFieldEntities().forEach(function (entity) {
                var onStoreChange = entity.onStoreChange;
                onStoreChange(prevStore, _this.getFieldsValue());
            });
        };
        this.setFieldsError = function (curErrors) {
            if (curErrors) {
                _this.errors = setValues(_this.errors, curErrors);
            }
        };
        this.setFieldsValue = function (curStore) {
            var _a = _this.callbacks.onTouched, onTouched = _a === void 0 ? function () { } : _a;
            var prevStore = _this.store;
            if (curStore) {
                Object.entries(curStore).forEach(function (_a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    _this.validateField(key, value);
                });
                _this.store = setValues(_this.store, curStore);
            }
            onTouched(curStore);
            _this.notifyObservers(prevStore);
        };
        this.registerField = function (entity) {
            _this.fieldEntities.push(entity);
            _this.rules[entity.props.name] = entity.props.rules;
            return function () {
                _this.fieldEntities = _this.fieldEntities.filter(function (item) { return item !== entity; });
                delete _this.store[entity.props.name];
                delete _this.rules[entity.props.name];
            };
        };
        this.submit = function () {
            var _a;
            var _b = _this.callbacks, _c = _b.onSubmit, onSubmit = _c === void 0 ? function () { } : _c, _d = _b.onError, onError = _d === void 0 ? function () { } : _d;
            var values = {};
            Object.keys((_a = _this.rules) !== null && _a !== void 0 ? _a : {}).forEach(function (_) {
                var _a;
                values[_] = (_a = _this.getFieldValue(_)) !== null && _a !== void 0 ? _a : "";
            });
            var errors = Object.entries(values)
                .map(function (_) { return _this.validateField(_[0], _[1]); })
                .filter(function (_) { return _; });
            if (!errors.length) {
                onSubmit(_this.getFieldsValue());
            }
            else {
                onError(_this.getFieldsErrors());
                _this.notifyObservers(_this.getFieldsValue());
            }
        };
        this.getInitialValue = function (namePath) { return getValue(_this.initialValues, namePath); };
        this.setInitialValues = function (initialValues, init) {
            _this.initialValues = initialValues;
            if (init) {
                _this.store = setValues({}, initialValues, _this.store);
            }
        };
        this.setCallbacks = function (callbacks) {
            _this.callbacks = callbacks;
        };
        this.getForm = function () { return ({
            getFieldsErrors: _this.getFieldsErrors,
            setFieldsError: _this.setFieldsError,
            getFieldError: _this.getFieldError,
            getFieldValue: _this.getFieldValue,
            getFieldsValue: _this.getFieldsValue,
            setFieldsValue: _this.setFieldsValue,
            registerField: _this.registerField,
            submit: _this.submit,
            getInternalHooks: function () { return ({
                setInitialValues: _this.setInitialValues,
                setCallbacks: _this.setCallbacks,
            }); },
        }); };
    }
    return FormStore;
}());
export default function useForm(form) {
    var formRef = React.useRef();
    if (!formRef.current) {
        if (form) {
            formRef.current = form;
        }
        else {
            var formStore = new FormStore();
            if (formRef.current)
                formRef.current = formStore.getForm();
        }
    }
    return [formRef.current];
}
