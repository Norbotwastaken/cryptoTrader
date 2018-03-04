// import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

export var Crypto = {
	// Different API, BTC only:
	// BTC: function(callback) {
	// 	var dates = [];
	// 	var prices = [];
	// 	HTTP.call('GET',
	// 	'https://www.quandl.com/api/v3/datasets/BCHARTS/ABUCOINSUSD.json?api_key=UJmhnosVCkYbtZLcyvKi', {
	// 		}, (error, result) => {
	// 		if (!error) {
	// 			// console.log(result);
	// 			for ( let i = 0; i < 7; i++ ) {
	// 				prices.push(Math.round(Number(result.data.dataset.data[i][7])));
	// 				dates.push(result.data.dataset.data[i][0]);
	// 			}
	// 			callback(prices, dates);
	// 		}
	// 	});
	// },
	BTC: {
		weekly: function(callback) {
			var prices = [];
			for (let i = 0; i < 7; i++) {
				let theDay = new Date(new Date().setDate(new Date().getDate() - i));
				let timestamp = Math.round( Number( theDay.getTime() / 1000));
				getPastPrice('BTC', timestamp, function(price) {
					prices.push(price);
					callback(prices);
				})
			}
		},
		current: function(callback) {
			HTTP.call('GET',
			'https://min-api.cryptocompare.com/data/price?fsym=' + 'BTC' + '&tsyms=USD', {
				}, (error, result) => {
				if (!error) {
					callback(JSON.parse(result.content).USD);
				}
			});
		}
	},
	ETH: {
		weekly: function(callback) {
			var prices = [];
			for (let i = 0; i < 7; i++) {
				let theDay = new Date(new Date().setDate(new Date().getDate() - i));
				let timestamp = Math.round( Number( theDay.getTime() / 1000));
				getPastPrice('ETH', timestamp, function(price) {
					prices.push(price);
					callback(prices);
				})
			}
		},
		current: function(callback) {
			HTTP.call('GET',
			'https://min-api.cryptocompare.com/data/price?fsym=' + 'ETH' + '&tsyms=USD', {
				}, (error, result) => {
				if (!error) {
					callback(JSON.parse(result.content).USD);
				}
			});
		}
	},
	XZC: {
		weekly: function(callback) {
			var prices = [];
			for (let i = 0; i < 7; i++) {
				let theDay = new Date(new Date().setDate(new Date().getDate() - i));
				let timestamp = Math.round( Number( theDay.getTime() / 1000));
				getPastPrice('XZC', timestamp, function(price) {
					prices.push(price);
					callback(prices);
				})
			}
		},
		current: function(callback) {
			HTTP.call('GET',
			'https://min-api.cryptocompare.com/data/price?fsym=' + 'XZC' + '&tsyms=USD', {
				}, (error, result) => {
				if (!error) {
					callback(JSON.parse(result.content).USD);
				}
			});
		}
	},
};

var getPastPrice = function(currency, timestamp, callback) {
	HTTP.call('GET',
	'https://min-api.cryptocompare.com/data/dayAvg?fsym=' + currency + '&tsym=USD&avgType=MidHighLow&toTs=' + timestamp, {
		}, (error, result) => {
		if (!error) {
			callback(Math.round(JSON.parse(result.content).USD));
		}
	});
};

var getCurrentPrice = function(currency, callback) {
	HTTP.call('GET',
	'https://min-api.cryptocompare.com/data/price?fsym=' + currency + '&tsyms=USD', {
		}, (error, result) => {
		if (!error) {
			callback(Math.round(JSON.parse(result.content).USD));
		}
	});
}