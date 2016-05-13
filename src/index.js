import { YaForm, FormActions } from 'meteor/ya-react-form';
import { CallPromiseMixin as callPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidationError } from 'meteor/mdg:validation-error';

const isNotValidationErrorMsg = 'ValidatedMethod\'s validate must throw an mdg:validation-error';

YaForm.validatedMethod = ({ name, method, onSubmit, onSuccess, onFailure, onValidation }) => {
  const validator = ({ form, dispatch }) => {
    try {
      // Runs ValidatedMethod's validate function
      method.validate(form);
    } catch (exception) {
      // Only accept valid error format
      if (ValidationError.is(exception)) {
        // Set the form level error
        dispatch(FormActions.error({ formName: name, reason: exception.reason }));
        // Set the field level errors
        exception.details.forEach(obj => {
          dispatch(FormActions.invalidateField(
            { formName: name, name: obj.name, reason: obj.type }
          ));
        });
      } else {
        throw new Error(isNotValidationErrorMsg);
      }
    }
  };
  // Add callPromise to ValidatedMethod if it doesn't exist.
  const makePromise = ({ form }) => {
    const promise = !method.hasOwnProperty('callPromise') ? callPromiseMixin(method) : method;
    return promise.callPromise({ ...form });
  };
  // onFailure is called when a server side error occurs
  const onFailureWrapped = ({ err, name, form, dispatch, getState }) => { // eslint-disable-line
    // In case user provided an onFailure callback.
    if (onFailure instanceof Function) onFailure({ err, name, form, dispatch, getState });
    // Set the form level error
    dispatch(FormActions.error({ formName: name, reason: err.reason }));
  };

  // Let the magic happen
  return YaForm.submit(
    { name, validator, onSubmit, onSuccess,
      onValidation, onFailure: onFailureWrapped, method: makePromise }
  );
};
