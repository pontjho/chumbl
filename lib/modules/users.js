var RestService = require('./rest-service');

function UsersMethods(makeRestRequest) {
  this.getUsers = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/users";
    makeRestRequest(options, callback);
  };

  this.getUser = function(options, callback) {
    options.verb = "get";
    options.url = "/{chumblr}/users/{email}";
    makeRestRequest(options, callback);
  };

  this.addUser = function(options, callback) {
    options.verb = "post";
    options.url = "/{chumblr}/users";
    options.data = options.user;
    makeRestRequest(options, callback);
  };
  
  this.updateUser = function(options, callback) {
    options.verb = "put";
    options.url = "/{chumblr}/users/{email}";
    options.data = options.user;
    makeRestRequest(options, callback);
  };

  this.generateToken = function(options, callback) {
    options.verb = "post";
    options.url = "/{chumblr}/users/generateToken";
    options.data = options.user;
    makeRestRequest(options, callback);
  };
}

function Users(baseUrl) {
  var restService = new RestService(baseUrl);
  this.users = new UsersMethods(restService.makeRestRequest);
}

module.exports = Users;
