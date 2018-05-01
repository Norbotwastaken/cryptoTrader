import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Crypto } from '../api/crypto.js';
import { CryptoConfig } from '../../cryptoConfig.js';

import './currentPrices.html';

var updatePrices = function() {
	CryptoConfig.currencies.forEach(currency => {
		Session.set('previous' + currency.TLA, Session.get('current' + currency.TLA));
		Crypto.current(currency.TLA, function(price) {
			Session.set('current' + currency.TLA, price);
		});
	});
}

Template.currentPrices.onRendered(function bodyOnCreated() {
	updatePrices();
	Meteor.setInterval(function() {
		updatePrices();
	}, 10000)
});

Template.currentPrices.helpers({
	cryptoTypes: CryptoConfig.currencies,
	currentValue(currency) {
		return Math.round( Number(Session.get('current' + currency)) * 100 ) / 100;
	},
	arrowType(currency) {
		if (Number(Session.get('previous' + currency)) >  Number(Session.get('current' + currency))) return '-down red';
		if (Number(Session.get('previous' + currency)) < Number(Session.get('current' + currency))) return '-up green';
		return '-right yellow';
	},
});