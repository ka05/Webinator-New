/**
 * Created by Clay on 12/15/2014.
 * Code Editor - Webinator
 */

// CODE EDITOR JS

/* javascript for handling code-editor section at bottom
* bottom panel (code editor) is designed similarly to the "dev tools" section in a web-browser
* */
define('code-editor', ['jquery', 'knockout', 'core-data', 'parser', 'bootstrap', 'jquery-ui'], function($, ko, coreData, parser) {
  var self = codeEditor = {};
  var currentDoc = "";

  function openPanel(_section) {
    $('#code-editor').show();
    $('#code-editor').addClass('active');
    var currTabType = _section.attr('data-secttype'),
      currTab = _section;

    // removes all active classes each time one is clicked
    $('.code-bar-btn').each(function () {
      $(this).removeClass('active');
    });

    //resets top of code editor wrapper
    $('#code-editor-wrap').css('top', ( $(window).height() - 120 ) + "px");

    switch (currTabType) {
      case "HTML":
        // style tab
        currTab.addClass('active');
        hideTabs('html');
        // populate section with info about DOM
        updatePanels(coreData.currEle);

        break;
      case "JS":
        // style tab
        currTab.addClass('active');
        hideTabs('js');
        // populate section with info about DOM
        if (PAGE.PAGEJS) {
          $('#code-editor-content-js').html('<div id="editor">' + PAGE.PAGEJS + '</div>');
        }
        else {
          $('#code-editor-content-js').html('No JS Content yet <br> Click (Add event) Button to create JS Code!');
        }
        break;
      case "CSS":
        // style tab
        currTab.addClass('active');
        hideTabs('css');

        if (CSSARRAY.length > 0) {
          updatePanels(coreData.currEle);
        }
        else {
          $('#code-editor-content-css').html('No CSS Content yet');
        }
        // populate section with info about DOM
        break;
      default:
        break;
    }
  }

  // returns styles for selected element
  function displayCSS(_ele) {
    // console.log(_ele);
    return _ele.attr('style');
  }

// attempt at displaying all css
// function displayCSS(){
//   var cssContent = "";

//   for(var i in CSSARRAY){
//     console.log(CSSARRAY[i]);
//     cssContent += "#" + CSSARRAY[i].eleId + " {<br>" 
//                   + CSSARRAY[i].eleStyle + "<br>}";
//   }

//   return cssContent;
// }

  function hideTabs(_eleToShow) {
    $('#code-editor div').each(function () {
      $(this).hide();
      $('#code-editor-content-' + _eleToShow).show();
    });
  }

  function closePanel() {
    $('#code-editor').hide();
    $('#code-editor').removeClass('active');

    $('.code-bar-btn').each(function () {
      $(this).removeClass('active');
    });

    // adjust wrapper top style on close
    $('#code-editor-wrap').css('top', ( $(window).height() - 24 ) + "px");

  }

  // populates panel with contents of template panel
  function updatePanels(_ele) {
    var val = document.getElementById('template-page-cont').innerHTML;
    val = parser.sanitizeString(val);
    currentDoc = val;
    val = val.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

    //populate html tab-pane
    $('#code-editor-content-html').html(val);

    if (_ele) {
      //populate css tab-pane
      $('#code-editor-content-css').html(displayCSS(_ele));
    }
  }

  // handles resizing dev tools pane
  $("#code-editor-wrap").resizable({
    handles: 'n',
    maxHeight: 450,
    minHeight: 28,
    resize: function (event, ui) {
      $('#code-editor').css('height', ( $(this).height() - 24 ) + "px");
      $('#code-editor-wrap').css('top', ( $(window).height() - $(this).height() ) + "px");
    }
  });

  // handles code editor pane height and top properties when window is resized
  $(window).resize(function () {
    utils.setPaneHeight();
    $('#code-editor-wrap').css('top', ( $(window).height() - 24 ) + "px");
  });

  // functions
  self.updatePanels = updatePanels;
  self.closePanel = closePanel;
  self.hideTabs = hideTabs;
  self.displayCSS = displayCSS;
  self.openPanel = openPanel;

  //variables
  self.currentDoc = currentDoc;

  return self;
});