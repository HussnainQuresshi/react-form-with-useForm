import * as React from "react";
import { UseFormContext } from "./types";

const context: UseFormContext = {};
const Context = React.createContext(context);

export default Context;
