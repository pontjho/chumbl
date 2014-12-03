var krc = require("kwaai-restcall");
var _baseUrl = "";
var _environment =  process.env.NODE_ENV || 'development';
if (_environment === "development") {
  _baseUrl = "http://localhost:1337";
} else if (_environment === "qa") {
  _baseUrl = "http://chumbl-api-qa.azurewebsites.net";
} else {
  _baseUrl = "https://api.chumbl.com";
}

function RestService(baseUrl) {
  if (baseUrl && typeof baseUrl === 'string') {
    _baseUrl = baseUrl;
  }

  var _restService = krc({
    headers: {
      "Content-Type": "application/json"
    },
    baseUrl: _baseUrl
  });

  this.makeRestRequest = function makeRestRequest(options, callback) {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.token) {
      options.headers.externalauthtoken = options.token;
      options.auth = {
        user: options.token,
        password: "xxxxxx"
      };
    }
    if (!options.auth && options.username && options.password) {
      options.auth = {
        user: options.username,
        password: options.password
      };
    }

    function serviceCalled(err, result, statusCode, location) {
      return callback(err, result, statusCode, location);
    }

    _restService.callRestService(options,serviceCalled);
  };
}

module.exports = RestService;
