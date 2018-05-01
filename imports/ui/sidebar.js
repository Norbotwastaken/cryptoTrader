import './sidebar.html';

import { Balance } from '../api/balance.js';
import { Session } from 'meteor/session';

Template.sidebar.helpers({
	balanceUSD() {
		var bal = Session.get('cryptoBalance');
		return Math.round( Number(bal.data.usd) * 10 ) / 10;
	},
});

Template.body.events({
	'click .reset-balance'(event, instance) {
		Meteor.call('balance.reset');
	},
});