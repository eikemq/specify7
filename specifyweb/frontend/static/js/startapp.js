define([
    'jquery', 'underscore', 'backbone', 'businessrules',
    'errorview', 'headerui', 'navigation', 'specifyapp',
// Tasks
    'datatask',
    'querytask',
    'treetask',
    'expresssearchtask',
    'datamodeltask',
    'attachmentstask',
    'wbtask',
    'wbimporttask'
], function module(
    $, _, Backbone, businessRules, errorview,
    HeaderUI, navigation, app) {
    "use strict";
    var tasks = _(arguments).tail(module.length);


    function handleUnexpectedError(event, jqxhr, settings, exception) {
        if (jqxhr.errorHandled) return; // Not unexpected.
        if (jqxhr.status === 403) {
            $('<div title="Insufficient Privileges">'
              + 'You lack sufficient privileges for that action, '
              + 'or your current session has been logged out.</div>')
                .appendTo('body').dialog({
                    modal: true,
                    open: function(evt, ui) { $('.ui-dialog-titlebar-close', ui.dialog).hide(); },
                    buttons: [{
                        text: 'Login',
                        click: function() {
                            window.location = "/accounts/login/?next=" + window.location.href;
                        }
                    }]});
            return;
        }
        new errorview.UnhandledErrorView({jqxhr: jqxhr}).render();

        console.log(arguments);
    }

    return function appStart() {
        console.info('specify app starting');
        // addBasicRoutes(router);
        $(document).ajaxError(handleUnexpectedError);
        businessRules.enable(true);
        new HeaderUI().render();
        _.each(tasks, function(task) { task(app); });

        // start processing the urls to draw the corresponding views
        Backbone.history.start({pushState: true, root: '/specify/'});

        $('body').delegate('a.intercept-navigation', 'click', function(evt) {
            evt.preventDefault();
            var href = $(evt.currentTarget).prop('href');
            href && navigation.go(href);
        });
    };

});
