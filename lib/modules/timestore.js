var RestService = require('./rest-service');

function TimestoreMethods(makeRestRequest) {

  this.getValues = function (options, callback) {
    var url = "/{chumblr}/timestores/{timestoreId}/{entityId}/{targetDate}";
    if (!options.targetDate) {
      url = url.replace("{targetDate}","");
    }
    options.verb="get";
    options.url=url;
    makeRestRequest(options,callback);
  };

  this.getTimeline = function(options, callback) {
    var attributes = "";
    if (options.attributes) {
      attributes = options.attributes.join(",");
    }

    var url = "/{chumblr}/timestores/{timestoreId}/{entityId}/timeline/{startDate}/{endDate}?attributes=" + attributes;
    options.verb = "get";
    options.url = url;
    makeRestRequest(options, callback);
  };

  this.queryEntities = function(options, callback) {
    var url = "/{chumblr}/timestores/{timestoreId}/entities/{targetDate}";
    if (!options.targetDate) {
      url = url.replace("/{targetDate}","");
    }
    if (options.query) {
      url += "?" + options.query;
    }
    options.verb="get";
    options.url=url;
    makeRestRequest(options, callback);
  };

  this.setValues = function(options, callback) {
    var url = "/{chumblr}/timestores/{timestoreId}/{entityId}/{targetDate}";
    if (!options.targetDate) {
      url = url.replace("/{targetDate}", "");
    }
    options.data = options.values;
    options.verb = "post";
    options.url = url;
    makeRestRequest(options, callback);
  };

  this.getTimestores = function(options, callback) {
    options.verb = "get";
    var url = "/{chumblr}/timestores";
    if (options.query) {
      url += "?" + options.query + "&select=_id,name";
    } else {
      url += "?select=_id,name";
    }
    options.url = url;
    makeRestRequest(options,callback);
  };

  this.getTimestore = function(options, callback) {
    options.verb = "get";
    if (options.timestoreName) {
      options.url = "/{chumblr}/timestores/{timestoreName}";
    } else {
      options.url="/{chumblr}/timestores/{timestoreId}";
    }
    makeRestRequest(options, callback);
  };

  this.addTimestore = function(options, callback) {
    options.verb = "post";
    options.url = "/{chumblr}/timestores";
    options.data = options.timestore;
    makeRestRequest(options,callback);
  };

  this.updateTimestore = function(options, callback) {
    options.verb="put";
    options.url="/{chumblr}/timestores/{timestoreId}";
    options.data=options.timestore;
    makeRestRequest(options,callback);
  };
}

function Timestore(baseUrl) {
  var restService = new RestService(baseUrl);
  this.timestore = new TimestoreMethods(restService.makeRestRequest);
}

module.exports = Timestore;
