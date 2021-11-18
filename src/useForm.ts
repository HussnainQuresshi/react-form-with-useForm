import { setValues, getValue } from "./utils/valueUtil";
import * as React from "react";
import { Rule, StateValue, ErrorValue, Store, UseFormContext } from "./types";

class FormStore {
  store: Store = {};

  errors: { [key: string]: ErrorValue } = {};

  rules: { [key: string]: Rule[] } = {};

  fieldEntities: any[] = [];

  initialValues: {
    [key: string]: StateValue;
  } = {};

  callbacks: any = {};

  getFieldValue = (name: string) => this.store[name];

  getFieldsValue = () => this.store;

  getFieldRules = (name: string) => this.rules[name] ?? [];

  getFieldsErrors = () => this.errors;

  getFieldError = (name: string) => this.errors?.[name]?.message || "";

  getFieldEntities = () => this.fieldEntities;

  validateField = (_: string, __: any) => {
    const rules = this.getFieldRules(_);
    let value = __;
    const name = _;

    if (typeof value === "object" || typeof value === "boolean") {
      value = value.value ? value.value : value || false;
    } else value = value?.trim();

    let errors: ErrorValue[] = [];
    rules.forEach((rule: Rule) => {
      const error: ErrorValue = {};
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
          if (rule.min)
            if (Number.isNaN(value)) error.hasError = value.length < rule.min;
            else error.hasError = value < rule.min;
          error.message = error.hasError
            ? rule.message ?? `value must be grater then ${rule.min}`
            : "";
          break;
        case "max":
          if (rule.max)
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
          if (rule.pattern && typeof rule.pattern === "object")
            error.hasError = !rule.pattern.test(value);
          error.message = error.hasError
            ? rule.message ?? `enter a valid email`
            : "";
          break;
        case "transform":
          if (typeof rule.transform === "function")
            error.hasError = rule?.transform?.(value);
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
    let [sinlgeError]: ErrorValue[] = errors.filter(
      ({ hasError }: any) => hasError,
    );

    if (value === "" || value === null || value === undefined) {
      const [isRequired] = rules.filter((r: any) => r?.required);
      if (!isRequired) {
        sinlgeError = { hasError: false, message: "" };
      }
    }
    this.setFieldsError({ [name]: sinlgeError });
    return errors;
  };

  notifyObservers = (prevStore: Store) => {
    this.getFieldEntities().forEach((entity: any) => {
      const { onStoreChange } = entity;
      onStoreChange(prevStore, this.getFieldsValue());
    });
  };

  setFieldsError = (curErrors: any) => {
    if (curErrors) {
      this.errors = setValues(this.errors, curErrors);
    }
  };

  setFieldsValue = (curStore: Store) => {
    const { onTouched = () => {} }: any = this.callbacks;
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

  registerField = (entity: any) => {
    this.fieldEntities.push(entity);
    this.rules[entity.props.name] = entity.props.rules;
    return () => {
      this.fieldEntities = this.fieldEntities.filter(
        (item: any) => item !== entity,
      );
      delete this.store[entity.props.name];
      delete this.rules[entity.props.name];
    };
  };

  submit = () => {
    const { onSubmit = () => {}, onError = () => {} }: any = this.callbacks;
    const values: any = {};
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

  getInitialValue = (namePath: any) => getValue(this.initialValues, namePath);

  setInitialValues = (initialValues: any, init: any) => {
    this.initialValues = initialValues;

    if (init) {
      this.store = setValues({}, initialValues, this.store);
    }
  };

  setCallbacks = (callbacks: {}) => {
    this.callbacks = callbacks;
  };

  getForm = (): UseFormContext => ({
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

export default function useForm(form?: UseFormContext) {
  const formRef: React.MutableRefObject<undefined | UseFormContext> =
    React.useRef();
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore: FormStore = new FormStore();
      if (formRef.current) formRef.current = formStore.getForm();
    }
  }
  return [formRef.current];
}
