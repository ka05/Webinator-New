/**
 * Created by Clay on 12/15/2014.
 * File Menu - Webinator
 */

// JS for File Menu
define('file-menu', ['jquery', 'knockout', 'core-data', 'utils', 'ele-tools', 'bootstrap'], function($, ko, coreData, utils, eleTools) {
  var self = fileMenu = {},
    modalTitle = ko.observable(),
    modalBodyTmpl = ko.observable("blank-tmpl"),
    accountBarTmpl = ko.observable("blank-tmpl"),
    createAccountUsername = ko.observable(),
    createAccountErrorMsg = ko.observable("");


  function handleMenu(_menuTitle) {
    //var menu = _menuTitle.attr('data-menu');
    var menu = _menuTitle;

    utils.resetModal();
    switch (menu) {
      case "about":
        $('#modal').modal('show');
        modalTitle('About Webinator');
        modalBodyTmpl('about-modal-tmpl');
        $("#save-btn").hide();
        break;
      case "version":
        $('#modal').modal('show');
        modalTitle('Webinator Version 3.5 Beta');
        $("#modal-body").html('This is a beta version.');
        $("#save-btn").hide();
        break;
      case "how to":
        $('#modal').modal('show');
        modalTitle('Help / How to / FAQ');
        $("#modal-body").html('<h2>This is a Help section</h2><p>will have to add documentation here later</p>');
        $("#save-btn").hide();
        break;
      case "save as":
        savePageAs();
        break;
      case "save this page":
        $('#modal').modal('show');
        modalTitle('Confirm Save');

        if (coreData.currPage.pageId) {
          $("#modal-body").html('Are you sure you want to save page: ' + coreData.currPage.pageName + '?');
          $("#save-btn").show();
          $("#save-btn").html("Yes");
          $('#save-btn').on('click', function () {
            //write current doc to local storage
            //use special key to store with (filename chosen by user and date)
            savePage(coreData.currPage.pageId);

            //saveTextAsFile('index.html');
            $('#modal').modal('hide');
          });
        }
        else {
          $("#modal-body").html('<div class="form-group">\
                                <label for="project-name" class="col-sm-4 control-label">Page Name</label>\
                                <div class="col-sm-6">\
                                  <input type="text" class="form-control" id="newPageInput" name="page-name" placeholder="Page Name">\
                                </div>\
                              </div>');
          $("#save-btn").show();
          $("#save-btn").html("Save");
          $('#save-btn').on('click', function () {
            //write current doc to local storage
            //use special key to store with (filename chosen by user and date)
            saveNewPage($('#newPageInput').val());

            //saveTextAsFile('index.html');
            $('#modal').modal('hide');
          });
        }

        break;
      case "create new project":
        showCreateNewProject();
        break;
      case "create new page":
        createNewPage();
        break;
      case "open":
        openPage();
        break;
      case "open from server":
        $('#modal').modal('show');
        modalTitle('Open from server');
        $("#modal-body").html('Development in progress...');

        $('#save-btn').html('Open');
        $('#save-btn').on('click', function () {
          $('#modal').modal('hide');
        });
        break;
      case "close":
        if (confirm("Close Window?")) {
          window.close();
        }
        break;
      case "account details":
        showAccountDetails();
        break;
      case "projects":
        showProjects();
        break;
      case "logout":
        logout();
        break;
      case "show login":
        showLogin();
        break;
      case "create account":
        showCreateAccount();
        break;
      case "add placeholder":
        showAddPlaceholderText();
        break;
      case "edit options":
        editOptions();
        break;
      case "edit radio":
        editRadioBtns();
        break;
      case "edit checkbox":
        editCheckBoxes();
        break;

    }
  }

  // logs the user out and clears all localstorage
  function logout() {
    localStorage.removeItem('webinator-username');
    accountBarTmpl("account-bar-login-tmpl");
    $('#account-bar').removeClass('logged-in');
    $('#file-menu').find('li').addClass('disabled');
    localStorage.removeItem('webinator-project');
    coreData.currProjectName("Blank Project");
    utils.clearPages(); // clear all active pages
    utils.pageContentTmpl("not-logged-in-tmpl");
  }


  self.showProjectChooser = function(){
    getProjects();
    $('#modal').modal('show');
    modalTitle('Account Details');
    modalBodyTmpl("project-chooser-tmpl");
  };

  // displays account info in a modal
  function showAccountDetails() {
    $('#modal').modal('show');
    modalTitle('Account Details');

    //utils.showMessage('Loading account details, please be patient!', 'thumb', 'loading.gif');
    utils.makeRequest(
      "action=getUser&userId=" + coreData.currUser.userId,
      function(data){
        if (data != "") {
          coreData.currUser = new coreData.User(data.data[0]);
          modalBodyTmpl("user-info-tmpl");
        }
      },
      true
    );

    $("#save-btn").hide();
  }

  /*
  * PAGES SECTION
  * */

  function createNewPage(_callback) {
    utils.resetModal();
    $('#modal').modal('show');
    modalTitle('Create New Page');
    modalBodyTmpl('create-page-tmpl');
    $('#save-btn').html('Create');
    $('#save-btn').unbind("click");
    $('#save-btn').on('click', function () {
      if ($('#newPageInput').val() == '') {
        alert("Please enter a page name!!");
      }
      else {
        // Returns successful data submission message when the entered information is stored in database.
        //utils.showMessage('Creating page, please be patient!', 'thumb', 'loading.gif');

        utils.makeRequest(
          "action=createPage" +
          "&pageName=" + $('#newPageInput').val() +
          "&projectName=" + coreData.currProject.projectName +
          "&userId=" + coreData.currUser.userId,
          function(data){
            if (data != "Already exists!") {
              if (data.success == "success") {
                coreData.currPage = new coreData.Page(data.data);
                var pageNameMsg = "Page: " + coreData.currPage.pageName + " Successfully Created";

                if (_callback) {
                  _callback();
                }

                $('#modal').modal('hide');
              }
              else {
                $('#create-page-fail-error').show();
              }
            }
            else {
              alert("Page with name: " + $('#newPageInput').val() + " already exists");
            }
          },
          false
        );

      }
    });
  }

  self.addPageToProject = function(){
    if( localStorage.getItem('webinator-username') != "" ){
      //resetModal();
      removeActiveClasses();
      createNewPage(function(){
        // callback function
        addPageCallBack(coreData.currPage.pageId, coreData.currPage.pageName);
        $('#pagelink-' + coreData.currPage.pageId).addClass('active'); // make current tab active
        $('#template-page-cont').html(''); // clear out page view
      });
    }
  };

  function promptRemoveProject(_projectId, _projectName){
    utils.resetModal();
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

        coreData.currProjectName(coreData.currProject.projectName);
      });
    }
  }

  function promptRemovePage(_ele){
    utils.resetModal();
    $('#modal').modal('show');
    $("#modal-title").html('Confirm Delete');

    if(coreData.currPage.pageId){
      $("#modal-body").html('Are you sure you want to delete page: ' + coreData.currPage.pageName + '?');
      $("#save-btn").show();
      $("#save-btn").html("Yes");
      $('#save-btn').on('click', function(){

        $.post("deletePage.php", {
          pageId: coreData.currPage.pageId
        }, function(data) {
          console.log(data);
          alert(data);
          removePage(_ele);
          $('.page-links').each(function(){ $(this).remove(); });
          getFirstPage();
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

  function addPageCallBack(_pageId, _pageName){
    //$(
    //  '<li role="presentation" class="page-links" data-link-id="' + _pageId + '" id="pagelink-' + _pageId + '">' +
    //    '<a href="#" role="tab" data-toggle="tab">' +
    //      _pageName +
    //      '<span data-id="page-' + _pageId + '-wrap" class="close-x-btn" onclick="promptRemovePage($(this));">×</span>' +
    //    '</a></li>'
    //).insertBefore($('#add-tab-btn'));

    $('.page-links').on('click', function(e){
      if(e.target.nodeName == "span"){
        // e.stopPropagation();
      }
      else{
        removeActiveClasses($(this));
        getPage($(this).attr('data-link-id'));
      }
    });
  }

  function removeActiveClasses(_ele){
    $('.page-links').each(function(){
      $(this).removeClass('active');
    });

    if(_ele){
      _ele.addClass("active");
      //set activePage
      coreData.currPage.pageId = _ele.attr('data-link-id');
    }
  }

  function parsePagePreSave() {
    $('#template-page-cont .dropped').each(function () {
      $(this).resizable("destroy");
      $(this).popover("hide");
    });
  }

  function parsePagePostSave() {
    $('#template-page-cont .dropped').each(function () {
      $(this).resizable({
        handles: "all"
      });
    });
  }

  function savePage() {
    //utils.showMessage('Saving your page, please be patient!', 'thumb', 'loading.gif');
    parsePagePreSave();

    utils.makeRequest(
      "action=savePage" +
      "&pageId=" + coreData.currPage.pageId +
      "&pageContent=" + $('#template-page-cont').html() +
      "&pageJS=" + coreData.currPage.pageJS,

      function (data) {
        if (data.msg != "Already exists") { // if page doesn't already exist
          if (data.success == "success") {
            var pageNameMsg = "Page: " + coreData.currPage.pageName + " Sucessfully Saved";
            showMessage(pageNameMsg, data.success, 4000);

            parsePagePostSave();
            $('#modal').modal('hide');
          }
          // else{
          //   $('#save-page-fail-error').show();
          // }
        }
        else {
          alert("Page with name: " + $('#newPageInput').val() + " already exists");
        }
      },
      true
    );
  }

  function savePageAs() {
    $('#modal').modal('show');
    modalTitle('Save as');
    modalBodyTmpl('save-page-as-tmpl');
    $("#save-btn").show();
    $("#save-btn").html("Save");
    $('#save-btn').on('click', function () {
      utils.saveTextAsFile($('#inputFileNameToSaveAs').val());
      $('#modal').modal('hide');
    });
  }



  function saveNewPage() {

  }

  function getPage(_pageId) {
    //utils.showMessage('Loading your page, please be patient!', 'thumb', 'loading.gif');
    utils.makeRequest(
      "action=getPage" +
      "&projectId=" + coreData.currProject.projectId +
      "&pageId=" + _pageId,

      function (data) {
        var page = data.data[0];
        coreData.currPage.pageName = page.pageName;
        coreData.currPage.pageId = page.pageId;

        // set to decoded JS
        coreData.currPage.pageJS = $("<div/>").html(page.pageJS).text();
        // load decoded JS into editor panel
        $('#code-editor-content-js').html(coreData.currPage.pageJS);

        //set to decoded HTML content
        coreData.currPage.pageContent = $("<div/>").html(page.pageContent).text();
        //load page into main div
        $('#template-page-cont').html(coreData.currPage.pageContent);
        $('.dropped').each(function () {
          initDraggable($(this));
        });

      },
      true
    );
  }

  function openPage() {
    utils.resetModal();
    modalTitle('Open file');
    var pagesArr, fileList;

    utils.makeRequest(
      "action=getPages" +
      "&projectId=" + coreData.currProject.projectId,
      function(data){
        if (data.success == "success") {
          pagesArr = data;

          fileList = '<div id="page-listing" class="btn-group btn-group-justified" data-toggle="buttons">';
          for (var i = 0; i < pagesArr.length; i++) {
            fileList += '<label class="btn btn-default"><input type="radio" class="hidden" name="page-to-load" value="' + pagesArr[i].pageId + '" data-page-id="' + pagesArr[i].pageId + '">' + pagesArr[i].pageName + '</label>';
          }

          fileList += '</div>';
          $("#modal-body").html('<h4>Select a File to Load:</h4>\
                            <p style="color:red;display:none;" id="page-to-load-selection-error">Please select an Page to Load!</p>\
                            <input type="file" id="fileToLoad" style="border:none; border-color: none; box-shadow: none; outline: none;">\
                            <br> OR Chose File from server <br><br>' + fileList);
        }
        else { // no files on server
          $("#modal-body").html('<h4>Select a File to Load:</h4>\
                          <p style="color:red;">\
                          <input type="file" id="fileToLoad" style="border:none; border-color: none; box-shadow: none; outline: none;">\
                          <br> OR Chose File from server <br><br>\
                          You Currently have no pages in project:' + coreData.currProject.projectName + '</p>\
                          <p>To create one click <b>File - > Create New Page</p>');
        }
      },
      true
    );

    //utils.showMessage('Loading pages, please be patient!', 'thumb', 'loading.gif');
    $('#modal').modal('show');
    $('#save-btn').html('Open');
    $('#save-btn').on('click', function () {

      if (!$('input:radio[name=page-to-load]:checked').val()) {
        $('#page-to-load-selection-error').show();
      }
      else {
        getPage($('input[name=page-to-load]:checked').val());
        $('#modal').modal('hide');
      }
      //loadFileAsText();
      $('#modal').modal('hide');
    });
  }

  // getFirstPage - gets first page available if one is avaliable
  function getFirstPage(_callback) {
    //utils.showMessage('Loading your project, please be patient!', 'thumb', 'loading.gif');
    utils.makeRequest(
      "action=getPages" +
      "&projectId=" + coreData.currProject.projectId,
      function (data) {
        if (data.success == "success") {
          var pages = data.data;
          for (var i = 0; i < pages.length; i++) {
            addPageCallBack(pages[i].pageId, pages[i].pageName);
            coreData.currProjectPages.push(new coreData.Page(pages[i]));
          }
          // override with decoded versions of pageContent and pageJS
          pages[0].pageContent = $("<div/>").html(pages[0].pageContent).text();
          pages[0].pageJS = $("<div/>").html(pages[0].pageJS).text();
          coreData.currPage = new coreData.Page(pages[0]); // instantiate current page as first page

          $('#code-editor-content-js').html(coreData.currPage.pageJS);
          $('#pagelink-' + coreData.currPage.pageId).addClass('active');
          $("#page-" + coreData.currPage.pageId).addClass('active');
          $('#template-page-cont').html(coreData.currPage.pageContent);

          coreData.currEle = $('#template-page-cont .dropped').eq(0);
          $('.dropped').each(function () {
            dragDrop.initDraggable($(this));
          });
          $("#pages-tabbar").append('<li role="presentation" id="add-tab-btn"><a href="#" data-bind="click: function(){ fileMenu.addPageToProject() }">+</a></li>');

          // initiates the callback
          if (_callback) {
            _callback();
          }
        }
        else {
          utils.pageContentTmpl("project-no-pages-tmpl");
        }
      },
      true
    );
  }



  /*
  * PROJECTS SECTION
  **/

  // displays a list of all projects
  // provides ability to delete, create and open a project from the modal
  function showProjects() {
    //utils.showMessage('Loading your projects, please be patient!', 'thumb', 'loading.gif');
    modalTitle('Projects');
    getProjects();

    $('#modal').modal('show');
    $('#delete-btn').show();
    $('#delete-btn').on('click', function () {
      if (!$('input:radio[name=project-to-load]:checked').val()) {
        $('#page-to-load-selection-error').show();
      }
      else {
        promptRemoveProject($('input[name=project-to-load]:checked').val(), $('input[name=project-to-load]:checked').attr("data-project-name"));
        utils.clearPages();
        //getFirstPage();
        //$('#modal').modal('hide');
      }
    });

    $('#save-btn').html('Open');
    $('#save-btn').on('click', function () {

      if (!$('input:radio[name=project-to-load]:checked').val()) {
        $('#page-to-load-selection-error').show();
      }
      else {
        getProject($('input[name=project-to-load]:checked').val(), $('input[name=project-to-load]:checked').attr("data-project-name"));
        utils.clearPages();
        getFirstPage();

        $('#modal').modal('hide');
      }
    });
  }

  function getProjects(){
    utils.makeRequest(
      "action=getProjects&userId=" + coreData.currUser.userId,
      function(data){
        if (data.success == "success") {
          for(var i = 0; i < data.data.length; i++) {
            coreData.userProjects.push( new coreData.Project(data.data[i]) );
          }
          modalBodyTmpl('project-list-tmpl');
        }
        else {
          modalBodyTmpl("project-list-empty-tmpl");
          $('#delete-btn').prop("disabled", "disabled");
        }
      },
      true
    );
  }

  function getProject(_projectId, _projectName) {
    coreData.currProject = new coreData.Project({
      "projectId":_projectId,
      "projectName":_projectName
    });
    localStorage.setItem('webinator-project', JSON.stringify(coreData.currProject));
    utils.clearPages(); // clear out all existing pages
    coreData.currProjectName(coreData.currProject.projectName);
    utils.pageContentTmpl("project-no-pages-tmpl");
  }

  function getFirstProject() {
    //utils.showMessage('Loading your project, please be patient!', 'thumb', 'loading.gif');

    utils.makeRequest(
      "action=getProjects&userId=" + coreData.currUser.userID,
      function(data){
        if (data != "") {
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              coreData.currProject.projectId = data[0].projectId;
              coreData.currProject.projectName = data[0].projectName;
            }
            getFirstPage();
            localStorage.setItem('webinator-project', JSON.stringify(coreData.currProject));
            coreData.currProjectName(coreData.currProject.projectName);
          }
          else {
            // no projects avaliable yet - tell user to create one
            utils.pageContentTmpl("no-projects-tmpl");
          }
        }
        else {
          utils.pageContentTmpl("no-projects-tmpl");
        }

      },
      true
    );
  }

  function showCreateNewProject() {

    modalTitle('Create New Project');
    modalBodyTmpl('create-project-tmpl');
    $('#modal').modal('show');
    $('#save-btn').show();
    $('#save-btn').html('Create');
    $('#save-btn').unbind("click");
    $('#save-btn').on('click', function () {
      createNewProject($('#newProject').val());
    });
  }

  function createNewProject(_projectName) {
    if (_projectName == '') {
      alert("Please enter a project name!!");
    }
    else {
      utils.makeRequest(
        "action=createProject"+
        "&projectName=" + _projectName +
        "&userId=" + coreData.currUser.userId,
        function(data){
          if (data.success == "success"){
            coreData.currProject = new coreData.Project(data.data); // grabs data from call and throws into Project Object
            var projectNameMsg = "Project: " + coreData.currProject.projectName + " Sucessfully Created";
            showMessage(projectNameMsg, data.success, 3000);
            // sets active/open project name and id
            getProject(coreData.currProject.projectId, coreData.currProject.projectName);

            $('#modal').modal('hide');
          }
          else {
            $('#create-project-fail-error').show();
          }
        },
        true
      ); // end makeRequest
    }
  }

  function showLogin(_username){
    $('#modal').modal('show');
    modalTitle('Login');
    modalBodyTmpl("modal-login-body");
    console.log(_username);
    if(_username != "undefined" && _username != "null" && _username != ""){
      createAccountUsername(_username);
    }
    else{
      createAccountUsername("");
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
        
        utils.makeRequest(
          "action=login" +
          "&username=" + username +
          "&password=" + password,
          function (data) {
            if(data.success == "success"){
              coreData.currUser = new coreData.User(data.data[0]);
              accountBarTmpl("account-bar-tmpl"); // set account bar template
              $('#account-bar').addClass('logged-in');
              $('#modal').modal('hide');

              localStorage.setItem('webinator-username', JSON.stringify(coreData.currUser));
              enableFileMenu();
              utils.pageContentTmpl("blank-tmpl"); // empty page content template
              getFirstProject();
            }
            else{
              //$('#login-fail-error').show();
              alert(data);
            }
          },
          false
        ); // end makeRequest
      }
    });
  }

  function showCreateAccount(){
    utils.resetModal();
    $('#modal').modal('show');
    modalTitle('Create Account');
    modalBodyTmpl("create-account-tmpl");

    $("#save-btn").html("Create Account");
    $('#save-btn').unbind('click');
    $("#save-btn").show();
    $('#save-btn').on('click', function(){
      var username = $("#create-account-username").val();
      var userEmail = $("#create-account-email").val();
      var userPass = $("#create-account-password").val();
      if (username == '' || userPass == '' || userEmail == '') {
        alert("Insertion Failed Some Fields are Blank....!!");
      }
      else {
        // Returns successful data submission message when the entered information is stored in database.
        utils.makeRequest(
          "action=createUser" +
          "&username=" + username +
          "&userPass=" + userPass +
          "&userEmail=" + userEmail,
          function (data) {
            if(data == "no errors"){
              // $('#modal').modal('hide');
              showLogin(username);
            }
            else{
              createAccountErrorMsg(data);
            }
          },
          null
        );

      }
    });
  }

  function showAddPlaceholderText(){
    $('#modal').modal('show');
    modalTitle('Add Placeholder Text');
    modalBodyTmpl("add-placholder-text-tmpl");
    // rewrite save btn functionality
    $('#save-btn').on('click', function() {
      if($('#placeholder-text-input').val() != ""){
        eleTools.addPlaceholderText($('#placeholder-text-input').val());
        $('#modal').modal('hide');
      }
      else{
        $('#placeholder-error-msg').show();
      }
    });
  }

  function enableFileMenu(){
    $('#file-menu').find('li').removeClass('disabled');
  }
  function disableFileMenu(){
    $('#file-menu').find('li').addClass('disabled');
  }

  function editOptions(){
    $('#modal').modal('show');
    modalTitle('Edit Options');
    var content = '<table class="table"><thead><tr><th>Name</th><th>Value</th><th></th><th></th></tr></thead><tbody>';

    coreData.currEle.find('option').each(function () {
      var currOpt = $(this);
      var currVal = $(this).attr('value');
      content += '<tr><td>' + $(this).html() + '</td><td>' + $(this).attr('value') + '</td><td></td><td><input type="button" class="btn btn-danger" onclick="$(this).parent().parent().remove();removeOption(\'' + currVal +'\');" value="Delete"/></td></tr>';
    });

    //add an option
    content += '<tr><td><input type="text" class="form-control" id="option-name-input" placeholder="Name"/></td><td><input class="form-control"  type="text" id="option-value-input" placeholder="Value"/></td><td><input class="btn btn-primary" type="button" value="Add" onclick="addOption(coreData.currEle, $(\'#option-value-input\').val(), $(\'#option-name-input\').val())"/></td></tr>';

    content += '</tbody></table>';
    $("#modal-body").html(content);
    $('#save-btn').html('Done');
    $('#save-btn').on('click', function() {
      $('#modal').modal('hide');
    });
  }

  function editRadioBtns(){
    $('#modal').modal('show');
    modalTitle('Edit Radio Buttons');
    var currRadioGroupName,
      content = '<div class="input-group">'
        + '<span class="input-group-addon">Radio Group Name:</span>'
        + '<input type="text" class="form-control" placeholder="Group Name" id="radio-group-name" onkeyup="addRadioName($(this).val())">'
        + '</div><br>'
        + '<table class="table" id="edit-radio-tbl"><thead><tr><th>Name</th><th>Text</th><th>Value</th><th>ID</th><th></th></tr></thead><tbody>';

    coreData.currEle.find('.radio-group').each(function () {
      currRadioGroupName = $(this).find('input[type=radio]').attr('name');
      content += '<tr><td class="radio-group-name">' + currRadioGroupName
      + '</td><td>' + $(this).find('label').html()
      + '</td><td>' + $(this).find('input[type=radio]').val()
      + '</td><th>' + $(this).find('input[type=radio]').attr('id')
      + '</th><td><input type="button" class="btn btn-danger" onclick="$(this).parent().parent().remove();removeRadio(\'' + $(this).find('input[type=radio]').attr('id') +'\');" value="Delete"/></td></tr>';

    });

    //add an option
    content += '<tr><td class="radio-group-name" id="radio-group-name-content">' + currRadioGroupName + '</td>' +
    '<td><input type="text" class="form-control" id="radio-label-input" placeholder="Text"/></td>' +
    '<td><input class="form-control"  type="text" id="radio-value-input" placeholder="Value"/></td>' +
    '<td><input class="form-control" type="text" id="radio-id-input" placeholder="ID"/></td>' +
    '<td><input class="btn btn-primary" type="button" value="Add" onclick="addRadio(coreData.currEle, $(\'#radio-value-input\').val(), $(\'#radio-label-input\').val(), $(\'#radio-id-input\').val(), $(\'#radio-group-name-content\').html())"/></td></tr>';

    content += '</tbody></table><div class="alert alert-danger" role="alert" id="radio-empty-input-err" style="display: none;">You must fill out all inputs!</div>';
    $("#modal-body").html(content);
    $("#save-btn").html("Done");
    $('#save-btn').on('click', function(){
      $('#modal').modal('hide');
    });
  }

  function editCheckBoxes(){
    $('#modal').modal('show');
    modalTitle('Edit Checkboxes');
    var content = '<table class="table" id="edit-checkbox-tbl">' +
      '<thead><tr><th>Name</th><th>Text</th><th>Value</th><th>ID</th><th></th></tr></thead><tbody>';

    coreData.currEle.find('.checkbox-group').each(function () {
      content += '<tr><td>' + $(this).find('input[type=checkbox]').attr('name')
      + '</td><td>' + $(this).find('label').html()
      + '</td><td>' + $(this).find('input[type=checkbox]').val()
      + '</td><th>' + $(this).find('input[type=checkbox]').attr('id')
      + '</th><td><input type="button" class="btn btn-danger" onclick="$(this).parent().parent().remove();removeCheckbox(\'' + $(this).find('input[type=checkbox]').attr('id') +'\');" value="Delete"/></td></tr>';

    });

    //add an option
    content += '<tr><td><input type="text" class="form-control" id="checkbox-name-input" placeholder="Name"/></td>' +
    '<td><input type="text" class="form-control" id="radio-label-input" placeholder="Text"/></td>' +
    '<td><input class="form-control"  type="text" id="radio-value-input" placeholder="Value"/></td>' +
    '<td><input class="form-control" type="text" id="radio-id-input" placeholder="ID"/></td>' +
    '<td><input class="btn btn-primary" type="button" value="Add" onclick="addCheckbox(coreData.currEle, $(\'#radio-value-input\').val(), $(\'#radio-label-input\').val(), $(\'#radio-id-input\').val(), $(\'#checkbox-name-input\').val())"/></td></tr>';

    content += '</tbody></table><div class="alert alert-danger" role="alert" id="checkbox-empty-input-err" style="display: none;">You must fill out all inputs!</div>';
    $("#modal-body").html(content);
    $("#save-btn").html("Done");
    $('#save-btn').on('click', function(){
      $('#modal').modal('hide');
    });
  }

  /*
  * FUNCTIONS
  * */

  // projects functions
  self.getFirstProject = getFirstProject;
  self.showCreateNewProject = showCreateNewProject;
  self.showProjects = showProjects;
  self.showLogin = showLogin;
  self.createNewPage = createNewPage;

  // pages functions
  self.getFirstPage = getFirstPage;

  // file menu functions
  self.enableFileMenu = enableFileMenu;
  self.disableFileMenu = disableFileMenu;

  self.openPage = openPage;
  self.editOptions = editOptions;
  self.showAddPlaceholderText = showAddPlaceholderText;
  self.handleMenu = handleMenu;

  // variables + templates
  self.modalTitle = modalTitle;
  self.modalBodyTmpl = modalBodyTmpl;
  self.accountBarTmpl = accountBarTmpl;
  self.createAccountUsername = createAccountUsername;
  self.createAccountErrorMsg = createAccountErrorMsg;

  return self;
});


