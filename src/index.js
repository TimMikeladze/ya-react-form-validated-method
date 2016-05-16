import { YaForm, FormActions } from 'meteor/ya-react-form';
import { CallPromiseMixin as callPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidationError } from 'meteor/mdg:validation-error';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const isNotValidationErrorMsg = 'ValidatedMethod\'s validate must throw an mdg:validation-error';

YaForm.config.validator = ({ form, method, dispatch, schema }) => {
  const options = schema && schema.hasOwnProperty('options') ? schema.options : {};
  const simpleSchema = schema && schema.hasOwnProperty('simpleSchema') ? schema.simpleSchema : {};
  try {
    // Runs ValidatedMethod's validate function
    debugger;
    if (method && method.hasOwnProperty('validate')) {
      method.validate(form, options);
    } else if (simpleSchema instanceof SimpleSchema) {
      const context = simpleSchema.newContext();
      context.validate(form, options);
    }
  } catch (exception) {
      // Set the form level error
    dispatch(FormActions.error({ formName: name, reason: exception.reason }));
      // Set the field level errors
    if (Array.isArray(exception.details)) {
      exception.details.forEach(obj => {
        dispatch(FormActions.invalidateField(
              { formName: name, name: obj.name, reason: obj.type }
            ));
      });
    }
  }
};

YaForm.validatedMethod = (
  { name, validator, method, onSubmit, onSuccess, onFailure, onValidation, schema }
) => {
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
      onValidation, onFailure: onFailureWrapped, schema,
      method: makePromise }
  );
};
