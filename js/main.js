/**
 * Example of Require.js boostrap javascript
 */

/* global requirejs:false */

requirejs.config({
    // Path mappings for the logical module names
    paths: {
        knockout: 'libs/knockout/knockout-3.5.0',
        jquery: 'libs/jquery/jquery-3.4.1.min',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1.min',
        ojs: 'libs/oj/v7.1.0/min',
        ojL10n: 'libs/oj/v7.1.0/ojL10n',
        ojtranslations: 'libs/oj/v7.1.0/resources',
        text: 'libs/require/text',
        promise: 'libs/es6-promise/es6-promise.min',
        hammerjs: 'libs/hammer/hammer-2.0.8.min',
        signals: 'libs/js-signals/signals.min',
        ojdnd: 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
        css: 'libs/require-css/css.min',
        customElements: 'libs/webcomponents/custom-elements.min',
        proj4: 'libs/proj4js/dist/proj4',
        touchr: 'libs/touchr/touchr'
    },
    // Shim configurations for modules that do not expose AMD
    shim: {
        jquery: {
            exports: ['jQuery', '$']
        }
    },

    // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
    // resources with a custom translation file.
    // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
    // a path that is relative to the location of this main.js file.
    config: {
        ojL10n: {
            merge: {
                // 'ojtranslations/nls/ojtranslations': 'resources/nls/myTranslations'
            }
        },
        text: {
            // Override for the requirejs text plugin XHR call for loading text resources on CORS configured servers
            // eslint-disable-next-line no-unused-vars
            useXhr: function(url, protocol, hostname, port) {
                // Override function for determining if XHR should be used.
                // url: the URL being requested
                // protocol: protocol of page text.js is running on
                // hostname: hostname of page text.js is running on
                // port: port of page text.js is running on
                // Use protocol, hostname, and port to compare against the url being requested.
                // Return true or false. true means "use xhr", false means "fetch the .js version of this resource".
                return true;
            }
        }
    }
});


/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback.
 *
 * For a listing of which JET component modules are required for each component, see the specific component
 * demo pages in the JET cookbook.
 */
require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojinputtext',
        'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojknockout-validation'
    ],
    function(oj, ko, $) {

        function LoginModel() {
            var self = this;
            self.user = ko.observable("");
            self.password = ko.observable("");
            self.submittedValue = ko.observable("");
            self.tracker = ko.observable();

            $("#myForm").on("submit", function(e) {
                //ensure the current active element is valid
                if ($(document.activeElement)) {
                    var currElem = $(document.activeElement)[0];
                    var valid = true;
                    if (currElem && currElem.type === "password") {
                        valid = $("#" + currElem.id).ojInputPassword("validate");
                    } else if (currElem && currElem.type === "text") {
                        valid = $("#" + currElem.id).ojInputText("validate");
                    }
                    if (!valid) {
                        self.submittedValue("Form submit aborted due to errors");
                        return false;

                    }
                }
                // ensure that no component in the page is invalid, before submitting the form.
                var tracker = self.tracker();
                if (tracker.invalidHidden || tracker.invalidShown) {
                    tracker.showMessages();
                    tracker.focusOnFirstInvalid();
                    self.submittedValue("Form submit aborted due to errors");
                    return false;
                }
                //submit your form here. For demo, I use preventdefault to demo it.
                self.submittedValue("Form submitted with values " + self.user() + " - " + self.password());
                e.preventDefault();
            });
        };

        $(function() {
            ko.applyBindings(new LoginModel(), document.getElementById('div1'));
            $("#text-user").focus();
        });

    });