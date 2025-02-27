sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/Press"
], function (Opa5,  Properties, Press) {
	"use strict";

	Opa5.createPageObjects({
		onTheFLPPage: {
			actions: {

				iPressOnAvatar: function () {
					return this.waitFor({
						id: "meAreaHeaderButton",
						actions: new Press(),
						errorMessage: "did not find the shell avatar button"
					});
				}

			},

			assertions: {


				iShouldSeeHelpPageButton: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.StandardListItem",
						matchers: new Properties({
							title: "Help for FLP page"
						}),
						success: function (aItems) {
							if (aItems && aItems.length > 0){
								aItems[0].firePress();
							}
							Opa5.assert.ok(true, "I am able to see help button");
						}
					});
				},

			}

		}

	});

});