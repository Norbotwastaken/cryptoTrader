import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import Chart from 'chart.js';
import { Crypto } from '../api/crypto.js';

import './cryptoChart.html';

CryptoCurrency = new Mongo.Collection('cryptoChart', { connection: null });
CryptoCurrency.insert({
	name: 'BTC'
});
CryptoCurrency.insert({
	name: 'ETH'
});
CryptoCurrency.insert({
	name: 'XZC'
});
let chartDates = [];
for (let i = 6; i >= 0; i--) {
	let theDay = new Date(new Date().setDate(new Date().getDate() - i));
	theDay += '';
	chartDates.push(theDay.substring(0,10));
}

var chartColors = [
	{
		backgroundColor: [
			'rgba(255, 99, 132, 0.2)',
		],
		borderColor: [
			'rgba(255, 99, 132, 1)',
		],
	},
	{
		backgroundColor: [
			'rgba(153, 102, 255, 0.2)',
		],
		borderColor: [
			'rgba(153, 102, 255, 1)',
		],
	},
	{
		backgroundColor: [
			'rgba(75, 192, 192, 0.2)',
		],
		borderColor: [
			'rgba(75, 192, 192, 1)',
		],
	},
];

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
			tooltips: {enabled: false},
    		hover: {mode: null},
		}
  	});
}

var refreshData = function() {
	Crypto.BTC.weekly(function(prices) {
		CryptoCurrency.update(
			{
				name: 'BTC',
			},
			{
				name: 'BTC',
				data: prices.reverse(),
			}
		);
	});
	Crypto.ETH.weekly(function(prices) {
		CryptoCurrency.update(
			{
				name: 'ETH',
			},
			{
				name: 'ETH',
				data: prices.reverse(),
			}
		);
	});
	Crypto.XZC.weekly(function(prices) {
		CryptoCurrency.update(
			{
				name: 'XZC',
			},
			{
				name: 'XZC',
				data: prices.reverse(),
			}
		);
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