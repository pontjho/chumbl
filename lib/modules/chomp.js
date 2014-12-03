var RestService = require('./rest-service');

function ChompMethods(makeRestRequest) {
  this.getChompQItem = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/chompq/{chompQId}";
    makeRestRequest(options, callback);
  };

  this.addQItemStatus = function(options, callback) {
    options.data = options.status;
    options.verb = "post";
    options.url = "/{chumblr}/chompq/{chompQId}/status";
    makeRestRequest(options, callback);
  };

  this.getChomps = function(options, callback) {
    options.verb = "get";
    var url = "/{chumblr}/chomps";
    if (options.query) {
      url += "?" + options.query + "&select=_id,name";
    } else {
      url += "?select=_id,name";
    }
    options.url = url;
    makeRestRequest(options, callback);
  };

  this.getChomp = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/chomps/{chompId}";
    makeRestRequest(options, callback);
  };

  this.runChomp = function(options, callback) {
    options.verb = "post";
    options.url = "/{chumblr}/chomps/{chompId}/run";
    options.data = options.inputData;
    makeRestRequest(options, callback);
  };

  this.addChomp = function(options, callback) {
    options.verb = "post";
    options.url = "/{chumblr}/chomps";
    options.data = options.chomp;
    makeRestRequest(options, callback);
  };

  this.updateChomp = function(options, callback) {
    options.verb = "put";
    options.url = "/{chumblr}/chomps/{chompId}";
    options.data = options.chomp;
    makeRestRequest(options, callback);
  };

  this.addScheduledRun = function(options, callback) {
    options.verb = "post";
    options.url = "/{chumblr}/chomps/{chompId}/scheduledruns";
    options.data = options.scheduledRun;
    makeRestRequest(options, callback);
  };

  this.getScheduledRuns = function(options, callback) {
    options.verb = "get";
    var url = "/{chumblr}/chomps/{chompId}/scheduledruns";
    if (options.query) {
      url += "?" + options.query;
    }
    options.url = url;
    makeRestRequest(options, callback);
  };

  this.getRunQ = function(options, callback) {
    options.verb = "get";
    var url = "/{chumblr}/chomps/{chompId}/runq";
    if (options.query) {
      url += "?" + options.query;
    }
    options.url = url;
    makeRestRequest(options, callback);
  };
}

function Chomp(baseUrl) {
  var restService = new RestService(baseUrl);
  this.chomp = new ChompMethods(restService.makeRestRequest);
}

module.exports = Chomp;
