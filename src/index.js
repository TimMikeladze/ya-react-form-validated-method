import { YaForm } from 'ya-react-form';

class YaFormValidatedMethod extends YaForm {
  submit(name, validatedMethod) {
    this.setValidator(({ name, form, schema, dispatch, state }) => {
      debugger;
    });
    return super.submit(name);
  }
}

export default YaFormValidatedMethod;
