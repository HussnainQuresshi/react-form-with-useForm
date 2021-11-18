import * as React from "react";
import { Store } from "./types";
export default class Field extends React.Component<any, any> {
    static contextType: React.Context<import("./types").UseFormContext>;
    cancelRegisterFunc: any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onStoreChange: (prevStore: Store, curStore: Store) => void;
    getControlled: () => {
        value: any;
        onChange: (event: any) => void;
        error: any;
    };
    render(): React.DetailedReactHTMLElement<{
        value: any;
        onChange: (event: any) => void;
        error: any;
    }, HTMLElement>;
}
