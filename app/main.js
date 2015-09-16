/**
 * webinator module: main module
 */
define('webinator', ['jquery', 'knockout', 'core-data', 'code-editor', 'drag-drop', 'parser', 'utils', 'file-menu', 'ele-tools', 'bootstrap', 'jquery-ui'], function($, ko, coreData, codeEditor, dragDrop, parser, utils, fileMenu, eleTools){

  var self = wbtr = {};


  // DOM Load function
  self.init = function(){

    // init tooltips
    $("[data-toggle='tooltip']").tooltip();
    $('#webinator-title').popover({
        html : true,
        content : '<a href="http://nova.it.rit.edu/~erw1825/DUEx/SuperUser/index.php">\
          <img src="img/webinator.png"><h4>An easy to use WYSIWYG Web IDE</h4></a>',
        placement : "bottom"
    });

    $('#template-page-cont').selectable({ filter: ".dropped" });

    // initialize heights of container divs
    utils.setPaneHeight();

    // dismiss popover
    $('body').on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
    // disables all toolbar inputs ( they are re-enabled after an element is dragged out )
    utils.disableToolbar();
    checkLoggedIn();
  };

  self.ensureTemplates = function(list) {
    var loadedTemplates = [];
    ko.utils.arrayForEach(list, function(name) {
      $.get("templates/" + name + ".tmpl.html", function(template) {
        $("body").append(template);
        loadedTemplates.push(name);
        if (list.length === loadedTemplates.length) {
          wbtr.init();
        }
      });
    });
  };

  function checkLoggedIn(){
    // if "account" is stored in localStorage
    if(window.localStorage.getItem("webinator-username")) {
      var user = JSON.parse(localStorage.getItem("webinator-username"));

      utils.makeRequest(
        "action=checkLoggedIn" +
        "&username=" + user.username,
        function (data) {
          if (data.success == "success") {
            // create new UserObject for current user if they are logged in already
            coreData.currUser = new coreData.User(user);
            fileMenu.accountBarTmpl("account-bar-tmpl");
            fileMenu.enableFileMenu();
            $('#account-bar').addClass('logged-in');

            // if a project exists in localstorage then pull it in and set it up
            if (localStorage.getItem('webinator-project')) {
              coreData.currProject = JSON.parse(localStorage.getItem('webinator-project'));
              fileMenu.getFirstPage();
              coreData.currProjectName(coreData.currProject.projectName);
            }
            else {
              //fileMenu.showCreateNewProject();
              // choose a project
              fileMenu.showProjects();
              //fileMenu.showProjectChooser();
            }
          } else {
            // error with checking logged in
            fileMenu.accountBarTmpl("account-bar-login-tmpl");
            fileMenu.handleMenu('show login');
            utils.pageContentTmpl("not-logged-in-tmpl"); // set pageContent to error message
            $('#file-menu').find('li').addClass('disabled');
          }
        },
        true
      );
    }else{
      // no account in localstorage
      fileMenu.accountBarTmpl("account-bar-login-tmpl");
      fileMenu.handleMenu('show login');
      utils.pageContentTmpl("not-logged-in-tmpl"); // set pageContent to error message
      fileMenu.disableFileMenu();
    }
  }


  //https://www.west-wind.com/WestwindWebToolkit/samples/Ajax/Html5AndCss3/KeyCodeChecker.aspx
  // use above reference for other keys
  // handles keypresses
  $(document).bind('keydown', function(e){
      // disable deleting for now
      // if(e.keyCode == 46){
      //   deleteElement(coreData.currEle);
      // }
      if( e.which === 90 && e.ctrlKey && e.shiftKey ){
          console.log('control + shift + z');
          redoAction(coreData.currEle);
      }
      else if( e.which === 90 && e.ctrlKey ){
          console.log('control + z');
          undoAction(coreData.currEle);
      }

      // ctrl + o
      if(e.ctrlKey && e.which === 79){
          fileMenu.openPage();
          e.preventDefault();
          return false;
      }

      // ctrl + n - new page
      // wont work because overrides browsers
      //if(e.ctrlKey && e.which === 78){
      //  createNewPage();
      //  e.preventDefault();
      //  return false;
      //}

      // create keypress listeners
      // ctrl + shift + s -> savePageAs()
      if (e.ctrlKey && e.shiftKey && e.which === 83) {
          // Save Function
          savePageAs();
          e.preventDefault();
          return false;
      }
      // ctrl + s -> savePageAs()
      if (e.ctrlKey && e.which === 83) {
          // Save Function
          savePage();
          e.preventDefault();
          return false;
      }
  });



  // DOM Parser
  Element.prototype.serializeWithStyles = (function () {

      // Mapping between tag names and css default values lookup tables. This allows to exclude default values in the result.
      var defaultStylesByTagName = {};

      // Styles inherited from style sheets will not be rendered for elements with these tag names
      var noStyleTags = {"BASE":true,"HEAD":true,"HTML":true,"META":true,"NOFRAME":true,"NOSCRIPT":true,"PARAM":true,"SCRIPT":true,"STYLE":true,"TITLE":true};

      // This list determines which css default values lookup tables are precomputed at load time
      // Lookup tables for other tag names will be automatically built at runtime if needed
      var tagNames = ["A","ABBR","ADDRESS","AREA","ARTICLE","ASIDE","AUDIO","B","BASE","BDI","BDO","BLOCKQUOTE","BODY","BR","BUTTON","CANVAS","CAPTION","CENTER","CITE","CODE","COL","COLGROUP","COMMAND","DATALIST","DD","DEL","DETAILS","DFN","DIV","DL","DT","EM","EMBED","FIELDSET","FIGCAPTION","FIGURE","FONT","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEAD","HEADER","HGROUP","HR","HTML","I","IFRAME","IMG","INPUT","INS","KBD","KEYGEN","LABEL","LEGEND","LI","LINK","MAP","MARK","MATH","MENU","META","METER","NAV","NOBR","NOSCRIPT","OBJECT","OL","OPTION","OPTGROUP","OUTPUT","P","PARAM","PRE","PROGRESS","Q","RP","RT","RUBY","S","SAMP","SCRIPT","SECTION","SELECT","SMALL","SOURCE","SPAN","STRONG","STYLE","SUB","SUMMARY","SUP","SVG","TABLE","TBODY","TD","TEXTAREA","TFOOT","TH","THEAD","TIME","TITLE","TR","TRACK","U","UL","VAR","VIDEO","WBR"];

      // Precompute the lookup tables.
      for (var i = 0; i < tagNames.length; i++) {
          if(!noStyleTags[tagNames[i]]) {
              defaultStylesByTagName[tagNames[i]] = computeDefaultStyleByTagName(tagNames[i]);
          }
      }

      function computeDefaultStyleByTagName(tagName) {
          var defaultStyle = {};
          var element = document.body.appendChild(document.createElement(tagName));
          var computedStyle = getComputedStyle(element);
          for (var i = 0; i < computedStyle.length; i++) {
              defaultStyle[computedStyle[i]] = computedStyle[computedStyle[i]];
          }
          document.body.removeChild(element);
          return defaultStyle;
      }

      function getDefaultStyleByTagName(tagName) {
          tagName = tagName.toUpperCase();
          if (!defaultStylesByTagName[tagName]) {
              defaultStylesByTagName[tagName] = computeDefaultStyleByTagName(tagName);
          }
          return defaultStylesByTagName[tagName];
      }

      return function serializeWithStyles() {
          if (this.nodeType !== Node.ELEMENT_NODE) { throw new TypeError(); }
          var cssTexts = [];
          var elements = this.querySelectorAll("*");
          for ( var i = 0; i < elements.length; i++ ) {
              var e = elements[i];
              if (!noStyleTags[e.tagName]) {
                  var computedStyle = getComputedStyle(e);
                  var defaultStyle = getDefaultStyleByTagName(e.tagName);
                  cssTexts[i] = e.style.cssText;
                  for (var ii = 0; ii < computedStyle.length; ii++) {
                      var cssPropName = computedStyle[ii];
                      if (computedStyle[cssPropName] !== defaultStyle[cssPropName]) {
                          e.style[cssPropName] = computedStyle[cssPropName];
                      }
                  }
              }
          }
          var result = this.outerHTML;
          for ( var i = 0; i < elements.length; i++ ) {
              elements[i].style.cssText = cssTexts[i];
          }
          return result;
      }
  })();


  // bind other modules to self
  self.fileMenu = fileMenu;
  self.utils = utils;
  self.codeEditor = codeEditor;

  return self;
});
