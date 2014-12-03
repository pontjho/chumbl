var RestService = require('./rest-service');

function TransactionMethods(makeRestRequest) {
  this.saveTransaction = function(options, callback) {
    options.data = options.transaction;
    options.verb = "post";
    options.url = "/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}";
    makeRestRequest(options, callback);
  };

  this.getTransaction = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}/{id}";
    makeRestRequest(options, callback);
  };

  this.getTransactions = function(options, callback) {
    var url = "/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}";
    if (options.query) {
      url += "?" + options.query;
    }
    options.verb = "get";
    options.url = url;

    function requestMade(err, result, statusCode, location) {
      return callback(err, result, statusCode, location);
    }
    makeRestRequest(options, requestMade);
  };

  this.getTransactionCount = function(options, callback) {
    var url = "/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}/count";
    if (options.query) {
      url += "?" + options.query;
    }
    options.verb = "get";
    options.url = url;
    makeRestRequest(options, callback);
  };

  this.getTransactionTypes = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/transactiontypes?select=_id,name";
    makeRestRequest(options, callback);
  };

  this.getTransactionType = function(options, callback) {
    if (options.transactionTypeName) {
      options.url = "/{chumblr}/transactiontypes/{transactionTypeName}";
    } else {
      options.url = "/{chumblr}/transactiontypes/{transactionTypeId}";
    }
    options.verb = "get";

    makeRestRequest(options, callback);
  };
}

function Transaction(baseUrl) {
  var restService = new RestService(baseUrl);
  this.transaction = new TransactionMethods(restService.makeRestRequest);
}

module.exports = Transaction;
