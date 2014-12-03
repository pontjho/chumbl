var RestService = require('./rest-service');

function VariablesMethods(makeRestRequest) {
  this.getVariables = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/variables?select=_id,name";
    makeRestRequest(options, callback);
  };

  this.getVariable = function(options, callback) {
    if (options.variableName) {
      options.url = "/{chumblr}/variables/{variableName}";
    } else {
      options.url = "/{chumblr}/variables/{variableId}";
    }
    options.verb = "get";
    makeRestRequest(options,callback);
  };

  this.getVariableValue = function(options, callback) {
    if (options.variableName) {
      options.url = "/{chumblr}/variables/{variableName}";
    } else {
      options.url = "/{chumblr}/variables/{variableId}";
    }
    options.verb = "get";

    function variableRetrieved(err, variable) {
      if (err) {
        return callback(err);
      }
      if (!variable) {
        return callback(null,null);
      }
      return callback(null, variable.value);
    }
    variables.getVariable(options,variableRetrieved);
  };
}

function Variables(baseUrl) {
  var restService = new RestService(baseUrl);
  this.variables = new VariablesMethods(restService.makeRestRequest);
}

module.exports = Variables;
