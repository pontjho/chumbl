var Timestore = require('./modules/timestore');
var Transaction = require('./modules/transaction');
var Lookup = require('./modules/lookup');
var Chomp = require('./modules/chomp');
var Variables = require('./modules/variables');
var Users = require('./modules/users');

module.exports = function (baseUrl) {

  var timestore = new Timestore(_baseUrl).timestore;
  var transaction = new Transaction(_baseUrl).transaction;
  var lookup = new Lookup(_baseUrl).lookup;
  var chomp = new Chomp(_baseUrl).chomp;
  var variables = new Variables(_baseUrl).variables;
  var users = new Users(_baseUrl).users;

  return {
    timestore: timestore,
    timestores: timestore,
    transaction: transaction,
    transactions: transaction,
    chomp: chomp,
    chomps: chomp,
    lookup: lookup,
    lookups: lookup,
    variables: variables,
    users: users
  };
};
