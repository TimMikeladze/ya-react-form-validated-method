import { YaForm } from 'ya-react-form';

class YaFormValidatedMethod extends YaForm {
  submit(name, validatedMethod) {
    this.setMethod(({ form }) =>
      new Promise((resolve, reject) =>
        validatedMethod.call(form, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        })
      )
    );

    this.setOnFailure((err, args) => {
      debugger;
    });
    return super.submit(name);
  }
}

export default YaFormValidatedMethod;
