import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { CryptoConfig } from '../../cryptoConfig.js';
import { Session } from 'meteor/session';

import { Balance } from '../api/balance.js';

import './cryptoChart.js';
import './currentPrices.js';
import './overview.html';

Template.overview.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	this.state.set('exchangeToCurrency', CryptoConfig.currencies[0].TLA);
	this.state.set('buySell', 'buy');
});

Template.overview.helpers({
	cryptoTypes: CryptoConfig.currencies,
	balanceCrypto(currency) {
		var bal = Session.get('cryptoBalance');
		// console.log(bal);
		// return bal.data[currency.toLowerCase()];
		return Math.round( Number(bal.data[currency.toLowerCase()]) * 1000 ) / 1000;
	},
	exchangeTo() {
		return Template.instance().state.get('exchangeToCurrency');
	},
});

Template.overview.events({
	'click .cryptoexchangetype': function( event, template ) {
		template.state.set( 'exchangeToCurrency', $( event.target ).text() );
	},
	'click .buyCryptoButton': function( event, template ) {
		Template.instance().state.set( 'buySell', 'buy' );
	},
	'click .sellCryptoButton': function( event, template ) {
		Template.instance().state.set( 'buySell', 'sell' );
	},
	'submit .exchange-form': function( event, template ) {
		event.preventDefault();
		Meteor.call('balance.exchange.' + Template.instance().state.get( 'buySell',), $(".exchangeAmount").val(),
			Template.instance().state.get('exchangeToCurrency'));
		event.target.reset();
	}
});

Template.overview.onRendered(function bodyOnCreated() {
	getBalance(function(bal) {
		Session.set('cryptoBalance', bal);
	});
	Meteor.setInterval(function() {
		getBalance(function(bal) {
			Session.set('cryptoBalance', bal);
		});
	}, 10000)
});

function getBalance(callback) {
	HTTP.call('GET',
	'https://obudai-api.azurewebsites.net/api/account/', {
		headers: { 'X-Access-Token': '033655EF-3DD4-4A6D-9023-08826545760F' }
	}, (error, result) => {
		if (!error) {
			callback(result);
		}
	});
}