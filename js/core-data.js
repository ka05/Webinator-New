/**
 * Created by Clay on 5/14/2015.
 */
define('core-data', ['jquery', 'knockout'], function($, ko) {
  var self = coreData = {};

  var CSSARRAY = [],
    PAGECOUNT = 1,
    PROCESSDOCUMENT,

    // new vars
    currUser,
    currPage,
    currProjectPages = ko.observableArray(),
    currProject,
    currProjectName = ko.observable("Blank Project"),
    currEle,
    cutEle,
    userProjects = ko.observableArray(),
    notification;

  self.Project = function(_projectObj){
    this.projectId = _projectObj.projectId;
    this.projectName = _projectObj.projectName;

    if(_projectObj.userId){
      this.userId = _projectObj.userId;
    }
  };

  self.Page = function(_pageObj){
    this.pageId = _pageObj.pageId;
    this.projectId = _pageObj.projectId;
    this.pageName = _pageObj.pageName;
    this.pageContent = _pageObj.pageContent;
    this.pageJS = _pageObj.pageJS;
  };

  self.User = function(_userObj){
    this.username = _userObj.username;
    this.userId = _userObj.userId;
    this.userEmail = _userObj.userEmail;
  };


  // variables - legacy
  self.CSSARRAY = CSSARRAY;
  self.PAGECOUNT = PAGECOUNT;
  self.PROCESSDOCUMENT = PROCESSDOCUMENT;
  // variables
  self.currUser = currUser;

  self.currPage = currPage;
  self.currProjectPages = currProjectPages;
  self.currProject = currProject;
  self.currProjectName = currProjectName;
  self.userProjects = userProjects;

  self.currEle = currEle;
  self.cutEle = cutEle;
  self.notification = notification;

  return self;
});