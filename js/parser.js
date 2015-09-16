/**
 * Created by Clay on 12/15/2014.
 * Parser - Webinator
 */


// PARSER JS
define('parser', ['jquery', 'knockout', 'core-data', 'bootstrap'], function($, ko, coreData) {
  var self = parser = {},
      DISALLOWED_CLASSES = ["ui-resizable-handle", "tooltip", "tooltip-arrow", "tooltip-inner"],
      DISALLOWED_IDS = ["guide-h", "guide-v"],
      DISALLOWED_ATTRIBUTES = ["data-item", "data-type", "data-toggle", "data-placement", "data-original-title", "contenteditable", "aria-describedby", "title"];

  //DISALLOWED_ATTRIBUTES = ["class", "data-type", "data-toggle", "data-placement", "data-original-title", "contenteditable", "aria-describedby", "title"];

  function sanitize(el) {
    //"Remove all tags from element `el' that aren't in the ALLOWED_TAGS list."
    var tags = Array.prototype.slice.apply(el.getElementsByTagName("*"), [0]);
    for (var i = 0; i < tags.length; i++) {
      // console.log(tags[i]);
      for(var j in tags[i].classList){
        //console.log(tags[i].id);
        if (DISALLOWED_CLASSES.indexOf(tags[i].classList[j]) != -1) {
          usurp(tags[i]);
        }

        if(DISALLOWED_IDS.indexOf(tags[i].id) != -1){
          // usurp(tags[i]);
          tags[i].remove();
        }

        if(tags[i].getAttribute("role") == "tooltip"){

        }
        else{
          stripAttributes(tags[i], DISALLOWED_ATTRIBUTES);
        }
      }
    }
  }

  function stripAttributes(_ele, _arr){
    for(var i in _arr){
      _ele.removeAttribute(_arr[i]);
    }
  }

  function usurp(p) {
    //"Replace parent `p' with its children.";
    if(p){
      var last = p;
      //console.log(p);

      if(p.hasChildNodes()){
        for (var i = p.childNodes.length - 1; i >= 0; i--) {
          var e = p.removeChild(p.childNodes[i]);
          p.parentNode.insertBefore(e, last);
          last = e;
        }
        if(p.parentNode){
          p.parentNode.removeChild(p);
        }
      }
    }
  }

  function sanitizeString(string) {
    var div = document.createElement("div");
    div.innerHTML = string;

    sanitize(div);
    parseCSS(div);
    return div.innerHTML;
  }

  function parseCSS(_ele){
    var tags = Array.prototype.slice.apply(_ele.getElementsByTagName("*"), [0]);
    for (var i = 0; i < tags.length; i++) {
      if(!tags[i].id){
        var d = new Date(),
          n = d.getTime();
        tags[i].id = "generated-id-" + n;
      }
      var tmpArr = {
        "eleName":tags[i].name,
        "eleStyles":tags[i].getAttribute('style'),
        "eleId":tags[i].id
      };
      coreData.CSSARRAY.push(tmpArr);
    }
  }

  // functions
  self.usurp = usurp;
  self.parseCSS = parseCSS;
  self.sanitize = sanitize;
  self.sanitizeString = sanitizeString;
  self.stripAttributes = stripAttributes;

  return self;
});