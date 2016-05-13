Package.describe({ // eslint-disable-line
  name: 'ya-react-form-validated-method',
  version: '0.0.1',
  summary: 'Extends ya-react-form to streamline usage with mdg:validated-method',
  documentation: 'README.md',
});

Package.onUse(function (api) { // eslint-disable-line
  api.versionsFrom('1.2.1');
  //TODO Remove ya-react-form and load via npm
  api.use(['ecmascript', 'ya-react-form', 'didericis:callpromise-mixin', 'mdg:validation-error']);
  api.mainModule('src/index.js', 'client');
});

Package.onTest(function(api) { // eslint-disable-line
});
