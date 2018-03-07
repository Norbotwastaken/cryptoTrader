import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { CryptoConfig } from '../../cryptoConfig.js';

export var Crypto = {
	daily: function(currency, callback) {
		var prices = [];

		for (let i = 23; i >= 0; i--) {
			setTimeout(function() {
				let now = new Date();
				let theDay = new Date(now.setHours(now.getHours() - i));
				let timestamp = Math.round( Number( theDay.getTime() / 1000));
				getPastPrice(currency, timestamp, function(price) {
					prices.push(price);
					callback(prices);
				});
			}, 500 * i); // This API allows 15 calls/sec 
		}
	},
	current: function(currency, callback) {
		HTTP.call('GET',
		'https://min-api.cryptocompare.com/data/price?fsym=' + currency + '&tsyms=USD', {
			}, (error, result) => {
			if (!error) {
				callback(JSON.parse(result.content).USD);
			}
		});
	},
	
};

var getPastPrice = function(currency, timestamp, callback) {
	Meteor.setTimeout(function(){
		HTTP.call('GET',
		'https://min-api.cryptocompare.com/data/dayAvg?fsym=' + currency + '&tsym=USD&avgType=MidHighLow&toTs=' + timestamp, {
			}, (error, result) => {
			if (!error) {
				callback(Math.round( JSON.parse(result.content).USD * 100 ) / 100);
			} else {
				console.log(error);
			}
		});
	}, 100);
};