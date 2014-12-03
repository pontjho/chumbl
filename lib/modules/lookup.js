var RestService = require('./rest-service');

function LookupMethods(makeRestRequest) {
  this.getLookups = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/lookups?select=_id,name";
    makeRestRequest(options, callback);
  };

  this.getLookup = function(options, callback) {
    if (options.lookupName) {
      options.url = "/{chumblr}/lookups/{lookupName}";
    } else {
      options.url = "/{chumblr}/lookups/{lookupId}";
    }
    options.verb = "get";

    makeRestRequest(options, callback);
  };

  this.getLookupValues = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/lookups/{lookupId}/values";
    var retryCnt = 5;
    makeRequest();
    function makeRequest() {
      retryCnt--;
      function requestMade(err, result, statusCode) {
        if (err) {
          return callback(err, result, statusCode);
        }
        if (!result&&retryCnt > 0) {
          console.warn("retrying get lookup");
          setTimeout(makeRequest,1000);
        } else {
          return callback(err,result,statusCode);
        }
      }
      makeRestRequest(options,requestMade);
    }
  };

  this.getLookupSchema = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/lookups/{lookupId}/schema";
    makeRestRequest(options, callback);
  };

  this.vLookup = function(options, callback) {
    var lookupId = null;
    if (options.lookupName) {
      lookupId=options.lookupName;
    } else {
      lookupId=options.lookupId;
    }

    function lookupRetrieved(err, lookupTable) {
      if (err) {
        return callback(err);
      }
      if (!lookupTable) {
        return callback("lookup table unavailable for vlookup:" + lookupId);
      }

      function lookupValuesRetrieved(err, lookupValues) {
        if (err) {
          return callback(err);
        }
        if (!lookupValues) {
          return callback("lookup table unavailable for vlookup:" + lookupId);
        }
        var foundValue = null;
        for (var i = 0; i < lookupValues.length; i++) {
          if (lookupValues[i][options.lookupColumn] === options.value) {
            if (lookupValues[i][options.returnColumn] || lookupValues[i][options.returnColumn] === 0) {
              foundValue = lookupValues[i][options.returnColumn];
            }
            break;
          }
        }
        return callback(null, foundValue);
      }
      options.lookupId = lookupTable._id.toString();
      lookup.getLookupValues(options,lookupValuesRetrieved);
    }
    lookup.getLookup(options,lookupRetrieved);
  };
}

function Lookup(baseUrl) {
  var restService = new RestService(baseUrl);
  this.lookup = new LookupMethods(restService.makeRestRequest);
}

module.exports = Lookup;
