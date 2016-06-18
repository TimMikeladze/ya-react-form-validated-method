import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { configureStore, Actions } from 'ya-react-form';
import YaFormValidatedMethod from '../src';

chai.use(spies);

describe('YaFormValidatedMethod', () => {
  let store;
  let dispatch;
  let yaForm;

  beforeEach(() => {
    store = configureStore();
    dispatch = store.dispatch;
    yaForm = new YaFormValidatedMethod(dispatch, store.getState());
  });

  it('calls validatedMethod', () => {
    dispatch(Actions.createForm('form1', {
      fields: {
        field1: {
          value: 'value1',
        },
      },
    }));

    const stub = {
      call(form, callback) {
        console.log(form);
        console.log(callback);
      },
    };

    const spy = chai.spy(stub, 'call');
    yaForm.submit('form1', stub);

    expect(spy).to.have.been.called();
  });

  it('');
});
