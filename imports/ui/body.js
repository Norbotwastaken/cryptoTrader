import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Balance } from '../api/balance.js';

import './sidebar.js';
import './overview.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('balance');
	Tracker.autorun(function () {
		Meteor.subscribe("userData");
	});
});

Template.body.events({
	'submit .signup-form': function(event, template) {
		event.preventDefault();
		Meteor.call('accounts.createUser', template.find(".signup-username").value,
			template.find(".signup-password").value,
			function(error, result){
				if (error) {
					alert(error);
				}
			});
	},
	"submit .login-form": function(event, template) {
		event.preventDefault();
		Meteor.loginWithPassword(
			template.find(".login-username").value,
			template.find(".login-password").value,
			function(error) {
				if (error) {
			}
		});
	},
	"submit .logout-form": function(event, template) {
		event.preventDefault();
		Meteor.logout(function(error) {
		});
	}
});