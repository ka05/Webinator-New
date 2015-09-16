// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "jquery.contextmenu": { "deps" :['jquery'] },
        "jquery.getattributes": { "deps" :['jquery'] },
        //"NotificationFx": { "deps" :['modernizr', 'classie']}
    },
    paths: {
        app: '../app',
        jquery: 'jquery',
        "jquery-ui": 'jquery-ui',
        "jquery.contextmenu": 'jquery.contextmenu',
        "jquery.getattributes": 'jquery.getattributes',
        "modernizr": 'notificationFx/js/modernizr.custom',
        "classie": 'notificationFx/js/classie',
        "snap-svg": 'notificationFx/js/snap.svg-min',
        notificationFx: 'notificationFx/js/notificationFx',
        knockout: 'knockout',
        bootstrap: 'bootstrap',
        "file-menu":'../js/file-menu',
        "utils":'../js/utils',
        "parser":'../js/parser',
        "code-editor":'../js/code-editor',
        "core-data":'../js/core-data',
        "drag-drop":'../js/drag-drop',
        "ele-tools":'../js/ele-tools',
        webinator:'../app/main'
    }
});


// Start loading the main app file. Put all of
// your application logic in there.
//requirejs(['app/main']);

define(['webinator', 'jquery', 'knockout', 'bootstrap'], function (wbtr, $, ko) {
  window._wbtr = wbtr;

  ko.applyBindings(wbtr, document.getElementById('webinator-body'));
  wbtr.ensureTemplates(["fileMenuViews", "modalViews", "accountBarViews", "pageContainerViews"]);
  //wbtr.init();

});