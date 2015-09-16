// Main JS

// Constants
//var JSFILE = "",
var CSSARRAY = [],
    ACCOUNT = {
        USERNAME:"",
        ACCOUNTID:"",
        EMAIL:""
    },
    PAGECOUNT = 1,
    PROJECT = {
        PROJECTNAME:"",
        PROJECTID:""
    },
    PAGE = {
        PAGENAME:"",
        PAGEID:"",
        PAGECONTENT:"",
        PAGEJS:""
    },
    PAGES = [],
    PROCESSDOCUMENT = $('#proccess-div'),
    currEle,
    notification;

function Page(_pageObj){
    this.pageId = _pageObj.pageId;
    this.pageName = _pageObj.pageName;
    this.pageContent = _pageObj.pageContent;
}


// DOM Load function
$(function () {
  // init tooltips
  $("[data-toggle='tooltip']").tooltip();
  $('#webinator-title').popover({
    html : true,
    content : '<a href="http://nova.it.rit.edu/~erw1825/DUEx/SuperUser/index.php">\
              <img src="img/webinator.png"><h4>An easy to use WYSIWYG Web IDE</h4></a>',
    placement : "bottom"
  });

  $('#template-page-cont').selectable({ filter: ".dropped" });

  // initialize hieghts of containerdivs 
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
    // diables all toolbar inputs ( they are re-enabled after an element is dragged out )
    $('#toolbar').find('select').prop('disabled', true);
    $('#toolbar').find('button').prop('disabled', true);
    $('#toolbar').find('input').prop('disabled', true);

    // local storage username - password combo
    var lsUserNameAndId = localStorage.getItem('webinator-username');

    // if username exist in localstorage set all globals
    if(lsUserNameAndId){
      var tmpUserNameAndId = lsUserNameAndId.split('-')[1];
      ACCOUNT.ACCOUNTID = tmpUserNameAndId;

      ACCOUNT.USERNAME = lsUserNameAndId.split('-')[0];
      var accountBar = '<div class="btn-group">'
                      + '<button type="button" class="dropdown-toggle btn-sp" data-toggle="dropdown">'
                      + '<a><img src="img/account.png" alt="account" height="15" style="padding-right:10px;">'
                      + ACCOUNT.USERNAME + '</a>'
                      + '</button>'
                      + '<ul class="dropdown-menu" role="menu">'
                      + '<li><a href="#" onclick="handleMenu(\'account details\')">Account Details</a></li>'
                      + '<li><a href="#" onclick="handleMenu(\'projects\')">Projects</a></li>'
                      + '<li><a href="#" onclick="handleMenu(\'logout\')">Logout</a></li>'
                      + '</ul>'
                      + '</div>';
      $('#account-bar').html(accountBar);
      $('#account-bar').addClass('logged-in');
      $('#file-menu').find('li').removeClass('disabled');

      // if a project exists in localstorage then pull it in and set it up
      if(localStorage.getItem('webinator-project')){
        PROJECT = JSON.parse(localStorage.getItem('webinator-project'));

        fileMenu.getFirstPage();
        $('#project-name-title').html(PROJECT.PROJECTNAME);
      }
      else{
        fileMenu.showCreateNewProject();
      }
    }
    else{
      showLogin();
      $('#template-page-cont').html('<h1 style="text-align:center;color: #980000;">You are not logged in!</h1>\
                                    <h3 style="text-align:center;">Please Login or Create an account</h3>');
      $('#file-menu').find('li').addClass('disabled');
    }
});


function promptRemovePage(_ele){
    resetModal();
    $('#modal').modal('show');
    $("#modal-title").html('Confirm Delete');

    if(PAGE.PAGEID){
        $("#modal-body").html('Are you sure you want to delete page: ' + PAGE.PAGENAME + '?');
        $("#save-btn").show();
        $("#save-btn").html("Yes");
        $('#save-btn').on('click', function(){
          
          $.post("deletePage.php", {
            pageId: PAGE.PAGEID
          }, function(data) {
            console.log(data);
            alert(data);
            removePage(_ele);
          });

          $('#modal').modal('hide');
        });
    }
    else{

    }
}


function removePage(_ele){

    _ele.parent().parent().remove();
    $('#' + _ele.attr('data-id')).remove();

    $('.page-links').each(function(){
        $(this).removeClass('active');
    });

    $('#pages-tabbar').find('li').eq(0).addClass('active');
}

function promptRemoveProject(_projectId, _projectName){
  resetModal();
  $('#modal').modal('show');
  $("#modal-title").html('Confirm Delete Project');

  if(_projectId){

    $("#modal-body").html('Are you sure you want to delete project: ' + _projectName + '?');
    $("#save-btn").show();
    $("#save-btn").html("Yes");
    $('#save-btn').on('click', function(){
      alert(_projectId);
      $.post("deleteProject.php", {
        projectId: _projectId
      }, function(data) {
        // showMessage("message-div", data, 5000);
        console.log(data);
        alert(data);


        localStorage.removeItem("webinator-project");
      });
      //$('#modal').modal('hide');
      showProjects();
      $('#select-proj-txt').html('<span style="color:red;">You must select a Project to Open:</span>');
      $('#project-name-title').html("Blank Project");
    });
  }
}

function showLogin(_username){
  resetModal();
  $('#modal').modal('show');
  $("#modal-title").html('Login');

  if(_username){
    $("#modal-body").html('<form class="form-horizontal" role="form">\
                                  <span id="login-fail-error" style="color:red;display:none;">Incorrect Username or Password! Please try again.</span>\
                                  <div class="form-group">\
                                      <label for="login-username" class="col-sm-2 control-label">Username</label>\
                                      <div class="col-sm-10">\
                                          <input type="email" class="form-control" id="login-username" placeholder="Username" value="' + _username + '">\
                                      </div>\
                                  </div>\
                                  <br>\
                                  <div class="form-group">\
                                      <label for="login-password" class="col-sm-2 control-label">Password</label>\
                                      <div class="col-sm-10">\
                                          <input type="password" class="form-control" id="login-password" placeholder="Password">\
                                      </div>\
                                  </div>\
                              </form>\
                              <div style="text-align:center;"><span style="color:red;">Dont have an account?</span><br><br>\
                              <input type="button" class="btn btn-primary btn-important" value="Create Account" onclick="showCreateAccount();"></div>');
  }
  else{
    $("#modal-body").html('<form class="form-horizontal" role="form">\
                                  <span id="login-fail-error" style="color:red;display:none;">Incorrect Username or Password! Please try again.</span>\
                                  <div class="form-group">\
                                      <label for="login-username" class="col-sm-2 control-label">Username</label>\
                                      <div class="col-sm-10">\
                                          <input type="email" class="form-control" id="login-username" placeholder="Username">\
                                      </div>\
                                  </div>\
                                  <br>\
                                  <div class="form-group">\
                                      <label for="login-password" class="col-sm-2 control-label">Password</label>\
                                      <div class="col-sm-10">\
                                          <input type="password" class="form-control" id="login-password" placeholder="Password">\
                                      </div>\
                                  </div>\
                              </form>\
                              <div style="text-align:center;"><span style="color:red;">Dont have an account?</span><br><br>\
                              <input type="button" class="btn btn-primary btn-important" value="Create Account" onclick="showCreateAccount();"></div>');
  }
  $("#save-btn").html("Login");
  $("#save-btn").show();
  $('#save-btn').on('click', function(){
    var username = $("#login-username").val();
    var password = $("#login-password").val();
    if (username == '' || password == '') {
      alert("Insertion Failed Some Fields are Blank....!!");
    }
    else {
      // Returns successful data submission message when the entered information is stored in database.
      $.post("login.php", {
        username: username,
        password: password
      }, function(data) {
        // showMessage("message-div", data, 5000);
        if(data != "login failed" && data != "please register!"){
          data = JSON.parse(data);
          //console.log(JSON.parse(data));
          ACCOUNT.ACCOUNTID = data.accountId;
          ACCOUNT.USERNAME = data.username;
          var accountBar = '<div class="btn-group">'
                          + '<button type="button" class="dropdown-toggle btn-sp" data-toggle="dropdown">'
                          + '<a><img src="img/account.png" alt="account" height="15" style="padding-right:10px;">'
                          + ACCOUNT.USERNAME + '</a>'
                          + '</button>'
                          + '<ul class="dropdown-menu" role="menu">'
                          + '<li><a href="#" data-menu="account details" onclick="handleMenu($(this))">Account Details</a></li>'
                          + '<li><a href="#" data-menu="projects" onclick="handleMenu($(this))">Projects</a></li>'
                          + '<li><a href="#" data-menu="logout" onclick="handleMenu($(this))">Logout</a></li>'
                          + '</ul>'
                          + '</div>';
          $('#account-bar').html(accountBar);
          $('#account-bar').addClass('logged-in');
          $('#modal').modal('hide');

          localStorage.setItem('webinator-username', ACCOUNT.USERNAME + "-" + ACCOUNT.ACCOUNTID);
          $('#file-menu').find('li').removeClass('disabled');
          $('#template-page-cont').html('');

          getFirstProject();

        }
        else{
          //$('#login-fail-error').show();
          alert(data);
        }
      });
    }
  });
}

function showCreateAccount(){
  resetModal();
  $('#modal').modal('show');
  $("#modal-title").html('Create Account');
  $("#modal-body").html('<form class="form-horizontal" role="form">\
                              <span id="create-account-fail-error" style="color:red;display:none;"></span>\
                              <div class="form-group">\
                                  <label for="create-account-username" class="col-sm-2 control-label">Username</label>\
                                  <div class="col-sm-10">\
                                      <input type="email" class="form-control" id="create-account-username" placeholder="Enter Username">\
                                  </div>\
                              </div>\
                              <br>\
                              <div class="form-group">\
                                  <label for="create-account-email" class="col-sm-2 control-label">Email</label>\
                                  <div class="col-sm-10">\
                                      <input type="text" class="form-control" id="create-account-email" placeholder="Enter Email">\
                                  </div>\
                              </div>\
                              <br>\
                              <div class="form-group">\
                                  <label for="create-account-password" class="col-sm-2 control-label">Password</label>\
                                  <div class="col-sm-10">\
                                      <input type="password" class="form-control" id="create-account-password" placeholder="Enter Password">\
                                  </div>\
                              </div>\
                          </form>');
  $("#save-btn").html("Create Account");
  $('#save-btn').unbind('click');
  $("#save-btn").show();
  $('#save-btn').on('click', function(){
    var username = $("#create-account-username").val();
    var email = $("#create-account-email").val();
    var password = $("#create-account-password").val();
    if (username == '' || password == '' || email == '') {
      alert("Insertion Failed Some Fields are Blank....!!");
    }
    else {
      // Returns successful data submission message when the entered information is stored in database.
      $.post("createAccount.php", {
        username: username,
        password: password,
        email:email
      }, function(data) {
        // showMessage("message-div", data, 5000);
        if(data == "no errors"){
          // $('#modal').modal('hide');
          showLogin(username);
        }
        else{
          $('#create-account-fail-error').show();
          $('#create-account-fail-error').html(data);
        }
      });
    }
  });
}

// displays modal for inserting an element
function insertElement(){
    resetModal();
    // show modal here
    $('#modal').modal('show');
    $("#modal-title").html('Insert and Element');
    $("#modal-body").html('some buttons and dropdowns will be here eventually.');
}

function showEventModal(_ele){
    resetModal();
    $('#modal').modal('show');
    $("#modal-title").html('Add event');
    $("#modal-body").html('<div>\
                                <div id="event-type-wrap" class="btn-group btn-group-justified" data-toggle="buttons">\
                                    <label class="btn btn-default"><input type="radio" class="hidden" name="event-type" value="click">onclick</label>\
                                    <label class="btn btn-default"><input type="radio" class="hidden" name="event-type" value="change">onchange</label>\
                                    <label class="btn btn-default"><input type="radio" class="hidden" name="event-type" value="mouseover">onmouseover</label>\
                                    <label class="btn btn-default"><input type="radio" class="hidden" name="event-type" value="keydown">onkeydown</label>\
                                    <label class="btn btn-default"><input type="radio" class="hidden" name="event-type" value="load">onload</label>\
                                </div>\
                                <p style="color:red;display:none;" id="event-type-selection-error">Please select an Event Type!</p>\
                                <p style="color:red;display:none;" id="event-type-id-error">Please add ID first!</p>\
                                <p style="color:red;display:none;" id="add-event-error">Please select an Element first!</p>\
                                <div style="display:none;" class="input-group" id="id-input-div">\
                                <span class="input-group-addon">Enter An ID: </span>\
                                <input type="text" style="height:36px;" class="form-control" id="id-name-input">\
                                <span class="input-group-addon" style="padding:0px;">\
                                    <input type="button" value="Add ID" class="btn btn-default" onclick="addID($(this))">\
                                </span></div>\
                                <hr>\
                                <div>\
                                    <label style="display: block;">function<input type="text" class="form-control" id="funct-name" name="NewFunct" placeholder="Function Name ...">(){</label>\
                                    <textarea style="display: block; width: 100%;" rows="5" id="funct-content" placeholder="Some JavaScript Goes Here..."></textarea>\
                                    <span>}</span>\
                                </div>\
                            </div>');
    

    if(_ele){
        $("#modal-title").html("Add event to this " + _ele.prop("tagName"));
        if(_ele.id){
            clickBindSaveBtn();
        }
        else{
            $('#save-btn').prop('disabled', true);
            $('#id-input-div').show();
            $('#event-type-id-error').show();
        }
        
    }
    else{
        $('#add-event-error').show();
        $("#modal-title").html("Add event to : nothing selected");
        $('#save-btn').prop('disabled', true);
        $('#save-btn').on('click', function(){
            console.info('must select and element first');
        });
    }
}

function clickBindSaveBtn(){
    $('#save-btn').on('click', function(){
        if(!$('input:radio[name=event-type]:checked').val()){
            $('#event-type-selection-error').show();
        }
        else{
            attachCustomFunct();
            //console.log(JSFILE);
            $('#modal').modal('hide');   
        }
    });
}

function addID(_ele) {
    if($('#id-name-input').val() != ""){
        currEle.attr('id', $('#id-name-input').val());
        $('#event-type-id-error').hide();
        $('#save-btn').prop('disabled', false);
        _ele.parent().parent().html('<span class="success">ID added successfully. Please continue building function.</span>\
                                    <p>The ID you added is "<span id="id-val">' + $('#id-name-input').val() + '</span>"</p>');
        clickBindSaveBtn();
    }
}

// display modal to add class to element
function addAClass(_ele){
    resetModal();
    $('#modal').modal('show');
    $("#modal-title").html('Add a Class');
    $("#modal-body").html('Enter Class Name: <input type="text" id="class-name-input">\
                            <p style="color:red;display:none;" id="add-class-error">Please select an element first!</p>');
    $('#save-btn').unbind( "click" );
    if(_ele){
        $('#save-btn').on('click', function(){
            _ele.attr("id", $('#id-name-input').val());
            $('#modal').modal('hide');
        });
    }
    else{
        $('#add-class-error').show();
        $('#save-btn').prop('disabled', true);
        $('#save-btn').on('click', function(){
            console.info('must select and element first');
        });
    }
}

// display modal to add id to element
function addAnId(_ele){
    resetModal();
    $('#modal').modal('show');
    $("#modal-title").html('Add an ID');
    $("#modal-body").html('Enter An ID: <input type="text" id="id-name-input">\
                        <p style="color:red;display:none;" id="add-id-error">Please select an element first!</p>');
    $('#save-btn').unbind( "click" );
    if(_ele){
        $('#save-btn').on('click', function(){
            _ele.attr("id", $('#id-name-input').val());
            $('#modal').modal('hide');
        });
    }
    else{
        $('#add-id-error').show();
        $('#save-btn').prop('disabled', true);
        $('#save-btn').on('click', function(){
            console.info('must select and element first');
        });
    }
}

// function to handle adding js 
function attachCustomFunct(){
    var fullFunction = "",
        eventFunction = "",
        functName = $('#funct-name').val(),
        functContent = $('#funct-content').val(),
        functParams = "",
        eventType = $('input[name=event-type]:checked').val();

    // if an event type was selected
    if(eventType){
        $('.funct-param').each(function(){
            // check if field was empty
            var val = $(this).val().trim();
            if(val != ""){
                functParams += $(this).val() + ",";
            }
        });

        // removes last comma
        functParams = functParams.replace(/,\s*$/, "");
        fullFunction = "function " + functName + "(" + functParams + "){<br>" 
                        + functContent + "<br>}<br>";
        
        eventFunction += "$('#" + $('#id-val').html() + "').on('" + eventType + "', function(){<br>" + functName + "(); <br>});";
        
        // add to global PAGE.PAGEJS
        PAGE.PAGEJS += fullFunction + "<br>" + eventFunction;

        // dismiss modal
        $('#modal').modal('hide');
    }
    else{
        console.log('please select a click event type');
        $('#event-type-selection-error').show();
    }
}

// shows a modal to add Image URL
function displayAddURLModal(){
    resetModal();
    currEle.popover('hide');
    $('#modal').modal('show');
    $("#modal-title").html('Add Image Via URL');
    $("#modal-body").html('<input type="text" class="form-control" id="img-url" placeholder="Enter URL to Image">\
                            <p style="color:red;display:none;" id="img-url-error">Please enter a URL!</p>');
    $('#save-btn').unbind( "click" );
    $('#save-btn').on('click', function(){
        if($('#img-url').val()){
            currEle.find('img').attr("src", $('#img-url').val());
            currEle.find('img').css('max-height', '400px');
            currEle.find('img').css('max-width', '400px');
            $('#modal').modal('hide');
        }
        else{
            $('#img-url-error').show();
        }
    });
}

// shows a modal to edit the address of a link
function showEditLinkModal(){
    resetModal();
    currEle.popover('hide');
    $('#modal').modal('show');
    $("#modal-title").html('Add Link Address');
    $("#modal-body").html('<b>Text you want the on the hyperlink:</b>\
                            <input type="text" class="form-control" id="link-text" placeholder="Text to display">\
                            <b>To what URL should this link go?</b> \
                            <input type="text" class="form-control" id="link-url" placeholder="Link Address">\
                            <input type="button" class="btn btn-default" value="Test this link" onclick="window.open($(\'#link-url\').val())">\
                            <p style="color:red;display:none;" id="link-url-error">Please enter a URL or link address!</p>');
    $('#save-btn').unbind( "click" );
    $('#save-btn').on('click', function(){
        if($('#link-url').val()){
            currEle.attr("href", $('#link-url').val());
            if($('#link-text').val()){
                currEle.html($('#link-text').val());
                $('#modal').modal('hide');
            }
            else{
                currEle.html($('#link-url').val());
                $('#modal').modal('hide');
            }
        }
        else{
            $('#link-url-error').show();
        }
    });
}

function moveForward(_ele){
    console.log(_ele.css('z-index'));
    _ele.css('z-index', (parseInt(_ele.css('z-index')) + 1));
    console.log(_ele.css('z-index'));
}

function moveBackward(_ele){
    console.log(_ele.css('z-index'));
    _ele.css('z-index', (_ele.css('z-index') - 1));
    console.log(_ele.css('z-index'));
}

// called after a new element has been dragged onto template
function postDragOutElement(_ele){
    var menu1 = [
      {'Insert Element':function(menuItem,menu) { insertElement(_ele); } },
      $.contextMenu.separator,
      {'Add ID':function(menuItem,menu) { addAnId(_ele); } },
      {'Add Class':function(menuItem,menu) { addAClass(_ele); } },
      {'Add an Event':function(menuItem,menu) { showEventModal(_ele); } },
      $.contextMenu.separator,
      {'Move Forward':function(menuItem,menu) { moveForward(_ele); } },
      {'Move Backward':function(menuItem,menu) { moveBackward(_ele); } },
      $.contextMenu.separator,
      {'Copy':function(menuItem,menu) { copyElement(_ele) } },
      {'Cut':function(menuItem,menu) { cutElement(_ele) } },
      {'Paste':function(menuItem,menu) { pasteElement(_ele) } },
      {'Delete':function(menuItem,menu) { deleteElement(_ele) } }
    ];
    $(function() {
      _ele.contextMenu(menu1,{theme:'gloss'});
    });
}

// deletes the selected element
function deleteElement(_currEle){
    PROCESSDOCUMENT.append(_currEle.clone());
    console.log(PROCESSDOCUMENT.html());
  $('.ui-selected').popover('destroy');
  $('.ui-selected').remove();
  
  $('.editing').popover('destroy');
  $('.editing').remove();

  _currEle.popover("destroy");
  _currEle.remove();
}

function copyElement(){
    var newEle = currEle.clone();
    newEle.prependTo('#template-page-cont');
    
    initDraggable(newEle);
}

function cutElement(){

}

function pasteElement(){

}

function undoAction(_ele){
    console.log("undo: ele: " +_ele);
    console.log(PROCESSDOCUMENT.html());
    console.log(PROCESSDOCUMENT.children().eq(0));
    var restoredEle = PROCESSDOCUMENT.children().eq(0);
    initDraggable(restoredEle);
    $('#template-page-cont').append(restoredEle);
}
function redoAction(_ele){
    console.log("undo: ele: " +_ele);
}


//https://www.west-wind.com/WestwindWebToolkit/samples/Ajax/Html5AndCss3/KeyCodeChecker.aspx
// use above reference for other keys
// handles keypresses
$(document).bind('keydown', function(e){
    // disable deleting for now
    // if(e.keyCode == 46){
    //   deleteElement(currEle);
    // }
    if( e.which === 90 && e.ctrlKey && e.shiftKey ){
     console.log('control + shift + z'); 
     redoAction(currEle);
    }
    else if( e.which === 90 && e.ctrlKey ){
     console.log('control + z'); 
     undoAction(currEle);
    }

    // ctrl + o
    if(e.ctrlKey && e.which === 79){
      openPage();
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


// function to handle preview

