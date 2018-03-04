import './sidebar.html';

import { Balance } from '../api/balance.js';

Template.sidebar.helpers({
	balanceUSD() {
		var bal = Balance.findOne(
			{ 'balanceMatcher': Meteor.user().balanceMatcher },
			{ 'balance': { USD: 1 }  }
		);
		if (bal) return Math.round( Number(bal.balance.USD) * 10 ) / 10;
	},
});

Template.body.events({
	'click .reset-balance'(event, instance) {
		Meteor.call('balance.reset');
	},
});