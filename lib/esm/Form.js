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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
import * as React from "react";
import useForm from "./useForm";
import FieldContext from "./FieldContext";
export default React.forwardRef(function (props, ref) {
    var _a, _b;
    var form = props.form, children = props.children, initialValues = props.initialValues, onSubmit = props.onSubmit, onError = props.onError, onTouched = props.onTouched, restProps = __rest(props, ["form", "children", "initialValues", "onSubmit", "onError", "onTouched"]);
    var _c = __read(useForm(form), 1), formInstance = _c[0];
    var _d = (_b = (_a = formInstance === null || formInstance === void 0 ? void 0 : formInstance.getInternalHooks) === null || _a === void 0 ? void 0 : _a.call(formInstance)) !== null && _b !== void 0 ? _b : {}, setInitialValues = _d.setInitialValues, setCallbacks = _d.setCallbacks;
    React.useImperativeHandle(ref, function () { return formInstance; });
    var mountRef = React.useRef(null);
    setInitialValues === null || setInitialValues === void 0 ? void 0 : setInitialValues(initialValues, !mountRef.current);
    if (!mountRef.current) {
        mountRef.current = true;
    }
    setCallbacks === null || setCallbacks === void 0 ? void 0 : setCallbacks({
        onSubmit: onSubmit,
        onError: onError,
        onTouched: onTouched,
    });
    return (React.createElement("form", __assign({}, restProps, { onSubmit: function (event) {
            var _a;
            event.preventDefault();
            event.stopPropagation();
            (_a = formInstance === null || formInstance === void 0 ? void 0 : formInstance.submit) === null || _a === void 0 ? void 0 : _a.call(formInstance);
        } }),
        React.createElement(FieldContext.Provider, { value: formInstance !== null && formInstance !== void 0 ? formInstance : {} }, children)));
});
