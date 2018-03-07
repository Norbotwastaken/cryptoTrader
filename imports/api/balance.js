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
		Balance.remove({
			balanceMatcher: Meteor.user().balanceMatcher
		});
		Meteor.call('balance.new', Meteor.user().balanceMatcher);
	},
	'balance.exchange.buy'(amount, currency) {
		Crypto.current(currency, function(price) {
			var priceOfCrypto = (amount * price);
			buy(priceOfCrypto, currency, amount);
		});
	},
	'balance.exchange.sell'(amount, currency) {
		Crypto.current(currency, function(price) {
			var priceOfCrypto = (amount * price);
			sell(priceOfCrypto, currency, amount);
		});
	}
});

var buy = function(priceOfCrypto, currency, amount) {
	var currentBalance = Balance.findOne(
		{ 'balanceMatcher': Meteor.user().balanceMatcher },
		{ 'balance': 1  }
	).balance;
	if (currentBalance.USD < priceOfCrypto) throw new Meteor.Error('insufficient-funds');
	var existingCryptoFunds = 0;
	if (currentBalance.crypto[currency]) existingCryptoFunds = Number(currentBalance.crypto[currency]);
	var totalCryptoAmount = existingCryptoFunds + Number(amount);
	var totalUSDAmount = Number(currentBalance.USD) - Number(priceOfCrypto);
	currentBalance.USD = totalUSDAmount;
	currentBalance.crypto[currency] = totalCryptoAmount;
	Balance.update(
		{ 'balanceMatcher': Meteor.user().balanceMatcher },
		{ $set: { 'balance': currentBalance } }
	);
}

var sell = function(priceOfCrypto, currency, amount) {
	var currentBalance = Balance.findOne(
		{ 'balanceMatcher': Meteor.user().balanceMatcher },
		{ 'balance': 1  }
	).balance;
	// console.log('Selling ' + amount + " " + currency + ' @ ' + priceOfCrypto);
	if (currentBalance.crypto[currency] < amount ||
		!currentBalance.crypto[currency] ||
		isNaN(currentBalance.crypto[currency])) throw new Meteor.Error('insufficient-funds');
	var totalCryptoAmount = Number(currentBalance.crypto[currency]) - Number(amount);
	var totalUSDAmount = Number(currentBalance.USD) + Number(priceOfCrypto);
	currentBalance.USD = totalUSDAmount;
	currentBalance.crypto[currency] = totalCryptoAmount;
	Balance.update(
		{ 'balanceMatcher': Meteor.user().balanceMatcher },
		{ $set: { 'balance': currentBalance } }
	);
}