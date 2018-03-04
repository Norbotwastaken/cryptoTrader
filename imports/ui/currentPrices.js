import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Crypto } from '../api/crypto.js';

import './currentPrices.html';

var updatePrices = function() {
	Session.set('previousBTC', Session.get('currentBTC'));
	Session.set('previousETH', Session.get('currentETH'));
	Session.set('previousXZC', Session.get('currentXZC'));
	Crypto.BTC.current(function(price) {
		Session.set('currentBTC', price);
	});
	Crypto.ETH.current(function(price) {
		Session.set('currentETH', price);
	});
	Crypto.XZC.current(function(price) {
		Session.set('currentXZC', price);
	});
}

Template.currentPrices.onRendered(function bodyOnCreated() {
	updatePrices();
	Meteor.setInterval(function() {
		updatePrices();
	}, 10000)
});

Handlebars.registerHelper('currentBTC', function() {
    return Session.get('currentBTC');
});

Handlebars.registerHelper('currentETH', function() {
    return Session.get('currentETH');
});

Handlebars.registerHelper('currentXZC', function() {
    return Session.get('currentXZC');
});

Template.currentPrices.helpers({
	arrowType(currency) {
		if (currency === 'BTC') {
			if (Number(Session.get('previousBTC')) >  Number(Session.get('currentBTC'))) return '-down red';
			if (Number(Session.get('previousBTC')) < Number(Session.get('currentBTC'))) return '-up green';
			return '-right yellow';
		}
		if (currency === 'ETH') {
			if (Number(Session.get('previousETH')) >  Number(Session.get('currentETH'))) return '-down red';
			if (Number(Session.get('previousETH')) < Number(Session.get('currentETH'))) return '-up green';
			return '-right yellow';
		}
		if (currency === 'XZC') {
			if (Number(Session.get('previousXZC')) >  Number(Session.get('currentXZC'))) return '-down red';
			if (Number(Session.get('previousXZC')) < Number(Session.get('currentXZC'))) return '-up green';
			return '-right yellow';
		}
	}
});