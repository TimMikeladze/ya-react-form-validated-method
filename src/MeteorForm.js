import React from 'react';
import { Form } from 'ya-react-redux-form';
import FormHandler from './FormHandler';

class MeteorForm extends Form {
  constructor(props, context) {
    super(props, context);
    const { dispatch, getState } = this.store;
    this.submit = this.submit.bind(this);
    this.handler = this.props.handler
      || Object.assign({}, this.handler, new FormHandler(dispatch, getState));
  }
}

MeteorForm.propTypes = {
  validatedMethod: React.PropTypes.object.required,
};

export default MeteorForm;
