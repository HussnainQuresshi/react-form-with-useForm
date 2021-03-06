import Item from "./Field";
import FormF from "./Form";
import useForm from "./useForm";

const Form: typeof FormF & { Item?: typeof Item; useForm?: typeof useForm } =
  FormF;
Form.Item = Item;
Form.useForm = useForm;
export default Form;
