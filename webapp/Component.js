sap.ui.define([
	"sap/ui/core/Component",
	"sap/base/util/ObjectPath",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Component, ObjectPath, MessageBox, JSONModel) {

	"use strict";

	return Component.extend("de.itsfullofstars.passwordreset.Component", {

		metadata: {
			"manifest": "json"
		},

		onClose: function(oAction) {

			if (oAction === "OK") {

				var userinfo = this._getUserInfo();
				userinfo.then(function(user) {
					var sId = user.getId();
					var sEmail = user.getEmail();

					// check if email exist
					var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					if (sEmail === undefined || !sEmail.match(mailformat) ) {
						MessageBox.alert("Password cannot be resetted. The E-Mail is missing in your user data.", {});
					} else {

						var model = new JSONModel();
						const sUrl = "/sap/bc/http/sap/zreset_password_user";
						const async = true;
						const type = "GET";
						
						// call backend service
						model.loadData(
							sUrl,
							async,
							type
						)
						.then( function(data) {
							MessageBox.success("Password reset process startet. Please check your inbox.", {});
						}.bind(this))
						.catch( function(error) {
							MessageBox.alert("An error occured. Please try again.", {});
						}.bind(this));
					}

				}.bind(this));
			}
		},


		init: function () {
			var rendererPromise = this._getRenderer();
			var oResourceBundle = this.getModel("i18n").getResourceBundle();

			/**
			 * Add two buttons to the options bar (previous called action menu) in the Me Area.
			 * The first button is only visible if the Home page of SAP Fiori launchpad is open.
			 */
			rendererPromise.then(function (oRenderer) {
				var _oResourceBundle = oResourceBundle;
				var onClose = this.onClose;
				var that = this;

				oRenderer.addActionButton("sap.m.Button", {
					id: "pwResetHomeButton",
					icon: "sap-icon://sys-help-2",
					text: _oResourceBundle.getText("buttonText"),
					press: function () {
						MessageBox.confirm(_oResourceBundle.getText("msgMeAreaText"), {
							onClose: onClose.bind(that)
						});
					}
				}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.Home]);

				/*
				 * The second button is only visible when an app is open.
				 */
				oRenderer.addActionButton("sap.m.Button", {
					id: "pwResetAppButton",
					icon: "sap-icon://sys-help",
					text: _oResourceBundle.getText("buttonText"),
					press: function () {
						MessageBox.confirm(_oResourceBundle.getText("msgMeAreaTextApp"), {
							onClose: onClose.bind(that)
						});
					}
				}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.App]);
			}.bind(this));

		},

		_getUserInfo: function() {
			return new Promise(resolve => {
				sap.ushell.Container.getServiceAsync("UserInfo")
					.then(function (UserInfo) {
						resolve(UserInfo);
					});
				});
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {Promise} a Promise which will resolve with the renderer instance, 
		 * 					   or be rejected with an error message.
		 */
		_getRenderer: function () {
			return new Promise(function(fnResolve, fnReject) {
				this._oShellContainer = ObjectPath.get("sap.ushell.Container");
				if (!this._oShellContainer) {
					fnReject(
						"Illegal state: shell container not available; this component must be executed in a unified shell runtime context."
					);
				} else {
					var oRenderer = this._oShellContainer.getRenderer();
					if (oRenderer) {
						fnResolve(oRenderer);
					} else {
						// renderer not initialized yet, listen to rendererCreated event
						this._onRendererCreated = function(oEvent) {
							oRenderer = oEvent.getParameter("renderer");
							if (oRenderer) {
								fnResolve(oRenderer);
							} else {
								fnReject(
									"Illegal state: shell renderer not available after receiving 'rendererLoaded' event."
								);
							}
						};
						this._oShellContainer.attachRendererCreatedEvent(
							this._onRendererCreated
						);
					}
				}
			}.bind(this));
		},

		exit: function () {
		    if (this._oShellContainer && this._onRendererCreated) {
			this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
		    }
		}
	});
});
