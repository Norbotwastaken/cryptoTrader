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
  appId: '1373879182758100',
  secret: '3f4d1b94fab2f2293782cdd36b522bd0'
});

Meteor.publish('userData', function () {
  return Meteor.users.find({_id: this.userId},
    { balanceMatcher: 1 });
});