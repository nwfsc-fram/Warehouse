'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
//  'myApp.view1',
  'myApp.view2',
  'myApp.metadatalist',
  'myApp.metadata',
  'myApp.version'
]).
config(['$routeProvider','$locationProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/map'});
}]).config(function($httpProvider, $locationProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
	// use the HTML5 History API
        $locationProvider.html5Mode(true);
});





var Dict = (function(){
    // IE 8 and earlier has no Array.prototype.indexOf
    function indexOfPolyfill(val) {
      for (var i = 0, l = this.length; i < l; ++i) {
        if (this[i] === val) {
          return i;
        }
      }
      return -1;
    }

    function Dict(){
      this.keys = [];
      this.values = [];
      if (!this.keys.indexOf) {
        this.keys.indexOf = indexOfPolyfill;
      }
    };

    Dict.prototype.has = function(key){
      return this.keys.indexOf(key) != -1;
    };

    Dict.prototype.get = function(key, defaultValue){
      var index = this.keys.indexOf(key);
      return index == -1 ? defaultValue : this.values[index];
    };

    Dict.prototype.set = function(key, value){
      var index = this.keys.indexOf(key);
      if (index == -1) {
        this.keys.push(key);
        this.values.push(value);
      } else {
        var prevValue = this.values[index];
        this.values[index] = value;
        return prevValue;
      }
    };

    Dict.prototype.delete = function(key){
      var index = this.keys.indexOf(key);
      if (index != -1) {
        this.keys.splice(index, 1);
        return this.values.splice(index, 1)[0];
      }
    };

    Dict.prototype.clear = function(){
      this.keys.splice(0, this.keys.length);
      this.values.splice(0, this.values.length);
    };

    return Dict;
})();






// Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

function CSV2JSON(csv) {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
}



