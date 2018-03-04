import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Balance } from '../api/balance.js';

import './cryptoChart.js';
import './currentPrices.js';
import './overview.html';

Template.overview.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	this.state.set('exchangeToCurrency', 'BTC');
});

Template.overview.helpers({
	balanceCrypto(currency) {
		// console.log(currency);
		var bal = Balance.findOne(
			{ 'balanceMatcher': Meteor.user().balanceMatcher },
			{ 'crypto': 1 }
		);
		if (bal && currency === 'BTC') return Math.round( Number(bal.balance.crypto.BTC) * 10 ) / 10;
		if (bal && currency === 'ETH') return Math.round( Number(bal.balance.crypto.ETH) * 10 ) / 10;
		if (bal && currency === 'XZC') return Math.round( Number(bal.balance.crypto.XZC) * 10 ) / 10;
	},
	exchangeTo() {
		return Template.instance().state.get('exchangeToCurrency');
	},
});

Template.overview.events({
	'click .cryptoexchangetype': function( event, template ) {
		if ( $( event.target ).text() === 'BTC' )
			template.state.set( 'exchangeToCurrency', 'BTC' );
		if ( $( event.target ).text() === 'ETH' )
			template.state.set( 'exchangeToCurrency', 'ETH' );
		if ( $( event.target ).text() === 'XZC' )
			template.state.set( 'exchangeToCurrency', 'XZC' );
	},
	'submit .exchange-form': function( event, template ) {
		event.preventDefault(); 
		Meteor.call('balance.exchange', $(".exchangeAmount").val(),
			Template.instance().state.get('exchangeToCurrency'));
		event.target.reset();
	}
});