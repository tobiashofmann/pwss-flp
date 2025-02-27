/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"de/itsfullofstars/passwordreset/test/integration/pages/FLPPlugin"
], function ( opaTest) {
	"use strict";

	QUnit.module("FLP Integration");



	opaTest("Should be able to Help Button", function (Given, When, Then) {
		// Arrangements
		Given.iStartFLP({
			intent: "Shell-Home"
		});
		//Actions
        When.onTheFLPPage.iPressOnAvatar();
		// Assertions
		Then.onTheFLPPage.iShouldSeeHelpPageButton();
	});

});