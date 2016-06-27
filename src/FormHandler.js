import { Actions, FormHandler } from 'ya-react-redux-form';

class MeteorFormHandler extends FormHandler {
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
    return super.submit(name);
  }

  onFailure(err, { name, dispatch }) {
    // Make sure is Meteor.Error
    if (err.hasOwnProperty('errorType') && err.errorType === 'Meteor.Error') {
      // Set form error
      dispatch(Actions.setFormError(name, err.reason));
      // Set field errors
      // TODO Use more descriptive error value than field.type
      if (Array.isArray(err.detail)) {
        err.details.forEach(
          field => dispatch(Actions.setFieldError(name, field.name, field.type))
        );
      }
    } else {
      throw new Error('Expected error to be of type Meteor.Error');
    }
  }

}

export default MeteorFormHandler;
