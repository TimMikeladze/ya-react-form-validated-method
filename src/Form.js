import React from 'react';
import { Form } from 'ya-react-redux-form';
import FormHandler from './FormHandler';

class MeteorForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    const { dispatch, getState } = this.store;
    debugger;
    const { name, validatedMethod } = this.props;
    const args = { dispatch, getState, name, validatedMethod };
    this.handler = this.props.handler || new FormHandler(args);
  }
  render() {
    return <Form {...this.props} />;
  }
}

MeteorForm.propTypes = {
  validatedMethod: React.PropTypes.object.required,
  name: React.PropTypes.string.isRequired,
  handler: React.PropTypes.object,
};

export default MeteorForm;
