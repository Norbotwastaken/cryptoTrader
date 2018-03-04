import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Crypto } from './crypto.js';

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
				crypto: {
					BTC: 0,
					ETH: 0,
					XZC: 0
				}
			}
		});
	},
	'balance.reset'() {
		Balance.remove({
			balanceMatcher: Meteor.user().balanceMatcher
		});
		Meteor.call('balance.new', Meteor.user().balanceMatcher);
	},
	'balance.exchange'(amount, currency) {
		let newBTC = 0;
		let newETH = 0;
		let newXZC = 0;
		var priceOfCrypto = 0;
		if (currency === 'BTC') {
			newBTC += Number(amount);
			Crypto.BTC.current(function(price) {
				priceOfCrypto += (amount * price);
				exchange(priceOfCrypto, 'BTC', amount);
			});
		}
		if (currency === 'ETH') {
			newETH += Number(amount);
			Crypto.ETH.current(function(price) {
				priceOfCrypto += (amount * price);
				exchange(priceOfCrypto, 'ETH', amount);
			});
		}
		if (currency === 'XZC') {
			newXZC += Number(amount);
			Crypto.XZC.current(function(price) {
				priceOfCrypto += (amount * price);
				exchange(priceOfCrypto, 'XZC', amount);
			});
		}
	}
});

var exchange = function(priceOfCrypto, currency, amount) {
	var currentBalance = Balance.findOne(
		{ 'balanceMatcher': Meteor.user().balanceMatcher },
		{ 'balance': { USD: 1 }  }
	).balance;
	// console.log('Exchanging ' + amount + " " + currency + ' @ ' + priceOfCrypto);
	if (currentBalance.USD < priceOfCrypto) throw new Meteor.Error('insufficient-funds');
	var crypto = {
		'BTC': Number(currentBalance.crypto.BTC),
		'ETH': Number(currentBalance.crypto.ETH),
		'XZC': Number(currentBalance.crypto.XZC),
	};
	if (currency === 'BTC') crypto.BTC = Number(crypto.BTC) + Number(amount);
	if (currency === 'ETH') crypto.ETH = Number(crypto.ETH) + Number(amount);
	if (currency === 'XZC') crypto.XZC = Number(crypto.XZC) + Number(amount);
	Balance.update(
		{ 'balanceMatcher': Meteor.user().balanceMatcher },
		{ 'balanceMatcher': Meteor.user().balanceMatcher,
			'balance': {
				'USD': currentBalance.USD - priceOfCrypto,
				'crypto': crypto
			}
	});
}