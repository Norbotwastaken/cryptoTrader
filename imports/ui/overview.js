import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { CryptoConfig } from '../../cryptoConfig.js';

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
		var bal = Balance.findOne(
			{ 'balanceMatcher': Meteor.user().balanceMatcher },
			{ 'crypto': 1 }
		);
		if (!bal) return 0;
		if (!bal.balance.crypto[currency]) return 0;
		return Math.round( Number(bal.balance.crypto[currency]) * 10 ) / 10;
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