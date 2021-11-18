import { useRef } from "react";
import { setValues, getValue } from "./utils/valueUtil";

class FormStore {
  store = {};

  errors = {};

  rules = {};

  fieldEntities = [];

  initialValues = {};

  callbacks = {};

  getFieldValue = (name) => this.store[name];

  getFieldsValue = () => this.store;

  getFieldRules = (name) => this.rules[name] ?? [];

  getFieldsErrors = () => this.errors;

  getFieldError = (name) => this.errors?.[name]?.message || "";

  getFieldEntities = () => this.fieldEntities;

  validateField = (_, __) => {
    const rules = this.getFieldRules(_);
    let value = __;
    const name = _;

    if (typeof value === "object" || typeof value === "boolean") {
      value = value.value ? value.value : value || false;
    } else value = value?.trim();

    let errors = [];
    rules.forEach((rule) => {
      const error = {};
      switch (Object.keys(rule).filter((___) => ___ !== "message")[0]) {
        case "required":
          if (rule.required) {
            error.hasError = !value;
            error.message = error.hasError
              ? rule.message ?? `${name} is required`
              : "";
          }
          break;
        case "min":
          if (Number.isNaN(value)) error.hasError = value.length < rule.min;
          else error.hasError = value < rule.min;
          error.message = error.hasError
            ? rule.message ?? `value must be grater then ${rule.min}`
            : "";
          break;
        case "max":
          if (Number.isNaN(value)) {
            error.hasError = value.length > rule.max;
          } else {
            error.hasError = value > rule.max;
          }
          error.message = error.hasError
            ? rule.message ?? `value must be less then ${rule.max}`
            : "";
          break;
        case "email":
          if (rule.email) {
            error.hasError =
              !/^\w+([\\+.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/i.test(value);
            error.message = error.hasError
              ? rule.message ?? `enter a valid email`
              : "";
          }
          break;
        case "password":
          if (rule.password) {
            error.hasError = !(
              /(?=.*[a-z])/.test(value) &&
              /(?=.*[A-Z])/.test(value) &&
              value?.length >= 8 &&
              /(?=.*\d)/.test(value)
            );
            error.message = error.hasError
              ? rule.message ??
                `Password must be 8 char long with 1 number and 1 capital and small alphabet`
              : "";
          }
          break;
        case "pattern":
          error.hasError = !rule.pattern.test(value);
          error.message = error.hasError
            ? rule.message ?? `enter a valid email`
            : "";
          break;
        case "transform":
          error.hasError = rule.transform(value);
          error.message = error.hasError
            ? rule.message ??
              `this value does not satisfy the transform condition`
            : "";
          break;
        default:
          break;
      }
      errors.push(error);
    });
    [errors] = errors.filter(({ hasError }) => hasError);

    if (value === "" || value === null || value === undefined) {
      const [isRequired] = rules.filter((r) => r?.required);
      if (!isRequired) {
        errors = undefined;
      }
    }
    this.setFieldsError({ [name]: errors });
    return errors;
  };

  notifyObservers = (prevStore) => {
    this.getFieldEntities().forEach((entity) => {
      const { onStoreChange } = entity;
      onStoreChange(prevStore, this.getFieldsValue());
    });
  };

  setFieldsError = (curErrors) => {
    if (curErrors) {
      this.errors = setValues(this.errors, curErrors);
    }
  };

  setFieldsValue = (curStore) => {
    const { onTouched = () => {} } = this.callbacks;
    const prevStore = this.store;
    if (curStore) {
      Object.entries(curStore).forEach(([key, value]) => {
        this.validateField(key, value);
      });
      this.store = setValues(this.store, curStore);
    }
    onTouched(curStore);
    this.notifyObservers(prevStore);
  };

  registerField = (entity) => {
    this.fieldEntities.push(entity);
    this.rules[entity.props.name] = entity.props.rules;
    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity);
      delete this.store[entity.props.name];
      delete this.rules[entity.props.name];
    };
  };

  submit = () => {
    const { onSubmit = () => {}, onError = () => {} } = this.callbacks;
    const values = {};
    Object.keys(this.rules ?? {}).forEach((_) => {
      values[_] = this.getFieldValue(_) ?? "";
    });
    const errors = Object.entries(values)
      .map((_) => this.validateField(_[0], _[1]))
      .filter((_) => _);
    if (!errors.length) {
      onSubmit(this.getFieldsValue());
    } else {
      onError(this.getFieldsErrors());
      this.notifyObservers(this.getFieldsValue());
    }
  };

  getInitialValue = (namePath) => getValue(this.initialValues, namePath);

  setInitialValues = (initialValues, init) => {
    this.initialValues = initialValues;

    if (init) {
      this.store = setValues({}, initialValues, this.store);
    }
  };

  setCallbacks = (callbacks) => {
    this.callbacks = callbacks;
  };

  getForm = () => ({
    getFieldsErrors: this.getFieldsErrors,
    setFieldsError: this.setFieldsError,
    getFieldError: this.getFieldError,
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFieldsValue: this.setFieldsValue,
    registerField: this.registerField,
    submit: this.submit,
    getInternalHooks: () => ({
      setInitialValues: this.setInitialValues,
      setCallbacks: this.setCallbacks,
    }),
  });
}

export default function useForm(form) {
  const formRef = useRef();
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }
  return [formRef.current];
}
