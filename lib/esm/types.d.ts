import React from "react";
export interface Rule {
    [key: string]: (Object & {
        test: (arg: string) => boolean;
    }) | undefined | string | boolean | ((arg: any) => boolean);
    message?: string;
}
export declare type StateValue = string | number | boolean | undefined | null | {
    label: string;
    value: string | number | boolean | undefined | null;
};
export interface ErrorValue {
    hasError?: boolean;
    message?: string;
}
export interface Store {
    [key: string]: StateValue;
}
export declare type FormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    form: UseFormContext;
    children: React.ReactNode | any;
    initialValues?: {
        [key: string]: StateValue;
    };
    onSubmit: (arg: {
        [key: string]: StateValue;
    }) => void;
    onError: (arg: {
        [key: string]: ErrorValue;
    }) => void;
    onTouched?: (arg: {
        [key: string]: StateValue;
    }) => void;
};
export interface UseFormContext {
    getFieldsErrors?: () => {
        [key: string]: ErrorValue;
    };
    setFieldsError?: (curErrors: any) => void;
    getFieldError?: (name: string) => string;
    getFieldValue?: (name: string) => StateValue;
    getFieldsValue?: () => Store;
    setFieldsValue?: (curStore: Store) => void;
    registerField?: (entity: any) => () => void;
    submit?: () => void;
    getInternalHooks?: () => {
        setInitialValues?: (initialValues: any, init: any) => void;
        setCallbacks?: (callbacks: {}) => void;
    };
}
