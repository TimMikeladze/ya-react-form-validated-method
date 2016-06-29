import { FormActions, FormHandler } from 'ya-react-redux-form';

class MeteorFormHandler extends FormHandler {
  constructor(args) {
    super(args);
    this.validatedMethod = args.validatedMethod;
    this.setMethod(({ form }) =>
      new Promise((resolve, reject) =>
        this.validatedMethod.call(form, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        })
      )
    );
    this.addOnFailure((err, { name, dispatch }) => {
      // Make sure is Meteor.Error
      if (err.hasOwnProperty('errorType') && err.errorType === 'Meteor.Error') {
        // Set form error
        dispatch(FormActions.setFormError(name, err.reason));
        // Set field errors
        // TODO Use more descriptive error value than field.type
        if (Array.isArray(err.detail)) {
          err.details.forEach(
            field => dispatch(FormActions.setFieldError(name, field.name, field.type))
          );
        }
      } else {
        throw new Error('Expected error to be of type Meteor.Error');
      }
    });
  }
}

export default MeteorFormHandler;
