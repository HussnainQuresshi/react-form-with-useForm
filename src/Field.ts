import * as React from "react";
import FieldContext from "./FieldContext";
import { Store } from "./types";

export default class Field extends React.Component<any, any> {
  // eslint-disable-next-line react/static-property-placement
  static contextType = FieldContext;

  cancelRegisterFunc: any;

  componentDidMount() {
    const { registerField } = this.context;
    this.cancelRegisterFunc = registerField(this);
  }

  componentWillUnmount() {
    if (this.cancelRegisterFunc) {
      this.cancelRegisterFunc();
    }
  }

  onStoreChange = (prevStore: Store, curStore: Store) => {
    const { shouldUpdate } = this.props;
    if (typeof shouldUpdate === "function") {
      if (shouldUpdate(prevStore, curStore)) {
        this.forceUpdate();
      }
    } else {
      this.forceUpdate();
    }
  };

  getControlled = () => {
    const { name, children, ...rest } = this.props;
    const { getFieldValue, setFieldsValue, getFieldError } = this.context;
    return {
      error: getFieldError(name),
      ...rest,
      value: getFieldValue(name),
      onChange: (event: any) => {
        const newValue = event.target.value;
        setFieldsValue({ [name]: newValue });
      },
    };
  };

  render() {
    const { children }: any = this.props;
    return React.cloneElement(children, { ...this.getControlled() });
  }
}
