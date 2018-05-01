import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { CryptoConfig } from '../../cryptoConfig.js';

export var Crypto = {
	daily: function(currency, callback) {
		var prices = [];
		var times = [];
		HTTP.call('GET',
		'https://obudai-api.azurewebsites.net/api/exchange/' + currency, {
			headers: { 'X-Access-Token': '033655EF-3DD4-4A6D-9023-08826545760F' }
		}, (error, result) => {
			if (!error) {
				var keyNames = Object.keys(result.data.history);
				var values = Object.values(result.data.history);
				var delta = Math.floor( values.length / 12 );
				for (i = 0; i < values.length; i += delta) {
					prices.push(values[i]);
					times.push(keyNames[i]);
				}
				callback(prices, times);
			}
		});
	},
	current: function(currency, callback) {
		HTTP.call('GET',
		'https://obudai-api.azurewebsites.net/api/exchange/' + currency, {
			headers: { 'X-Access-Token': '033655EF-3DD4-4A6D-9023-08826545760F' }
		}, (error, result) => {
			if (!error) {
				callback(result.data.currentRate);
			}
		});
	},
	
};