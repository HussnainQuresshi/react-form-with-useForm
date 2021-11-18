import Item from "./Field";
import FormF from "./Form";
import useForm from "./useForm";
declare const Form: typeof FormF & {
    Item?: typeof Item;
    useForm?: typeof useForm;
};
export default Form;
