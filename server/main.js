import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import '../imports/api/balance.js';

Accounts.onCreateUser((options, user) => {
  var balanceMatcher = Random.id();
  const customizedUser = Object.assign({
    balanceMatcher: balanceMatcher,
  }, user);
  if (options.profile) {
    customizedUser.profile = options.profile;
  }
  Meteor.call('balance.new', balanceMatcher);
  return customizedUser;
});

ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  // Insert app certs here:
  service: "facebook",
  appId: '',
  secret: ''
});

Meteor.publish('userData', function () {
  return Meteor.users.find({_id: this.userId},
    { balanceMatcher: 1 });
});