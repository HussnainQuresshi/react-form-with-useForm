import * as React from "react";
declare const _default: React.ForwardRefExoticComponent<Pick<React.ClassAttributes<HTMLFormElement> & React.FormHTMLAttributes<HTMLFormElement> & {
    form: import("./types").UseFormContext;
    children: any;
    initialValues?: {
        [key: string]: import("./types").StateValue;
    } | undefined;
    onSubmit: (arg: {
        [key: string]: import("./types").StateValue;
    }) => void;
    onError: (arg: {
        [key: string]: import("./types").ErrorValue;
    }) => void;
    onTouched?: ((arg: {
        [key: string]: import("./types").StateValue;
    }) => void) | undefined;
}, "key" | "form" | "onTouched" | keyof React.FormHTMLAttributes<HTMLFormElement> | "initialValues"> & React.RefAttributes<unknown>>;
export default _default;
