import { YaForm, Actions } from 'ya-react-form';

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

    this.setOnFailure((err, { name, dispatch }) => { // eslint-disable-line no-shadow
      // Make sure is Meteor.Error
      if (err.hasOwnProperty('errorType') && err.errorType === 'Meteor.Error') {
        // Set form error
        dispatch(Actions.setFormError(name, err.reason));
        // Set field errors
        // TODO Use more descriptive error value than field.type
        err.details.forEach(
          field => dispatch(Actions.setFieldError(name, field.name, field.type))
        );
      } else {
        throw new Error('Expected error to be of type Meteor.Error');
      }
    });
    return super.submit(name);
  }
}

YaFormValidatedMethod.create = (name, validatedMethod, dispatch) =>
  dispatch((() => (thunkDispatch, thunkGetStore) =>
    new YaFormValidatedMethod(thunkDispatch, thunkGetStore()).submit(name, validatedMethod)
  )()
);

export default YaFormValidatedMethod;
