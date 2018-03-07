import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import Chart from 'chart.js';
import { Crypto } from '../api/crypto.js';
import { CryptoConfig } from '../../cryptoConfig.js';

import './cryptoChart.html';

CryptoCurrency = new Mongo.Collection('cryptoChart', { connection: null });
var getChartColor = function() {
	let col1 = Math.round(Math.random() * (255 - 10) + 10);
	let col2 = Math.round(Math.random() * (255 - 10) + 10);
	let col3 = Math.round(Math.random() * (255 - 10) + 10);
	return {
		backgroundColor: [
			'rgba(' + col1 + ', ' + col2 + ', ' + col3 + ', 0.2)',
		],
		borderColor: [
			'rgba(' + col1 + ', ' + col2 + ', ' + col3 + ', 1)',
		],
	}
}
let chartDates = [];
let chartColors = [];
for (let i = 23; i >= 0; i--) {
	var d = new Date();
	d.setHours(d.getHours() - i);
	var hours = d.getHours();
	var minutes = "0" + d.getMinutes();
	var formattedTime = hours + ':' + minutes.substr(-2);
	chartDates.push(formattedTime);
}
for (let i = 0; i <= CryptoConfig.currencies.length; i++) {
	chartColors.push(getChartColor());
}

var updateChart = function() {
	var chartData = CryptoCurrency.find({}).fetch();
	var datasets = [];
	for (let i = 0; i < chartData.length; i++) {
		let data = {
			label: chartData[i].name,
			data: chartData[i].data,
			backgroundColor: chartColors[i].backgroundColor,
			borderColor: chartColors[i].borderColor,
			borderWidth: 2
		}
		datasets.push(data);
	}
	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: chartDates,
			datasets: datasets
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			},
			events: ['click'],
			// tooltips: {enabled: false},
    		hover: {mode: null},
		}
  	});
}

var refreshData = function() {
	CryptoConfig.currencies.forEach(currency => {
		CryptoCurrency.insert({
			name: currency.Displayname
		});
	});
	CryptoConfig.currencies.forEach(currency => {
		Crypto.daily(currency.TLA, function(prices) {
			CryptoCurrency.update(
				{
					name: currency.Displayname,
				},
				{
					name: currency.Displayname,
					data: prices
				}
			);
		});
	});
}

Template.cryptoChart.onCreated(function() {
	Meteor.subscribe('cryptoChart');
});

Template.cryptoChart.onRendered(function() {
	refreshData();
	Tracker.autorun(() => {
		updateChart();
	});
});