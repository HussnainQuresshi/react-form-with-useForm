var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import * as React from "react";
import FieldContext from "./FieldContext";
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    function Field() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onStoreChange = function (prevStore, curStore) {
            var shouldUpdate = _this.props.shouldUpdate;
            if (typeof shouldUpdate === "function") {
                if (shouldUpdate(prevStore, curStore)) {
                    _this.forceUpdate();
                }
            }
            else {
                _this.forceUpdate();
            }
        };
        _this.getControlled = function () {
            var _a = _this.props, name = _a.name, children = _a.children, rest = __rest(_a, ["name", "children"]);
            var _b = _this.context, getFieldValue = _b.getFieldValue, setFieldsValue = _b.setFieldsValue, getFieldError = _b.getFieldError;
            return __assign(__assign({ error: getFieldError(name) }, rest), { value: getFieldValue(name), onChange: function (event) {
                    var _a;
                    var newValue = event.target.value;
                    setFieldsValue((_a = {}, _a[name] = newValue, _a));
                } });
        };
        return _this;
    }
    Field.prototype.componentDidMount = function () {
        var registerField = this.context.registerField;
        this.cancelRegisterFunc = registerField(this);
    };
    Field.prototype.componentWillUnmount = function () {
        if (this.cancelRegisterFunc) {
            this.cancelRegisterFunc();
        }
    };
    Field.prototype.render = function () {
        var children = this.props.children;
        return React.cloneElement(children, __assign({}, this.getControlled()));
    };
    // eslint-disable-next-line react/static-property-placement
    Field.contextType = FieldContext;
    return Field;
}(React.Component));
export default Field;
