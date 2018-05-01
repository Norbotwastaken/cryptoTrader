import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Crypto } from './crypto.js';
import { CryptoConfig } from '../../cryptoConfig.js';

export const Balance = new Mongo.Collection('balance');

if (Meteor.isServer) {
	Meteor.publish('balance', function balancePublication() {
		if (Meteor.user())
		return Balance.find({
			balanceMatcher: Meteor.user().balanceMatcher
		});
	});
}

Meteor.methods({
	'balance.new'(balanceMatcher) {
		Balance.insert({
			balanceMatcher: balanceMatcher,
			balance: {
				USD: 5000,
				crypto: {}
			}
		});
	},
	'balance.reset'() {
		HTTP.call('POST',
		'https://obudai-api.azurewebsites.net/api/account/reset', {
			headers: { 'X-Access-Token': '033655EF-3DD4-4A6D-9023-08826545760F'},
		}, (error, result) => {
			if (error) {
				console.log(error);
			}
		});
	},
	'balance.exchange.buy'(amount, currency) {
		HTTP.call('POST',
		'https://obudai-api.azurewebsites.net/api/account/purchase/', {
			headers: { 'X-Access-Token': '033655EF-3DD4-4A6D-9023-08826545760F',
			"value": "application/json"},
			data:{ "Symbol": currency, "Amount": amount / 2 }
		}, (error, result) => {
			if (error) {
				console.log(error);
			}
		});
	},
	'balance.exchange.sell'(amount, currency) {
		HTTP.call('POST',
		'https://obudai-api.azurewebsites.net/api/account/sell/', {
			headers: { 'X-Access-Token': '033655EF-3DD4-4A6D-9023-08826545760F',
			"value": "application/json"},
			data:{ "Symbol": currency, "Amount": amount / 2 }
		}, (error, result) => {
			if (error) {
				console.log(error);
			}
		});
	}
});