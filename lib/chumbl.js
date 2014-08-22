//*********************************************************************************************************************************************************************
//requires
//*********************************************************************************************************************************************************************
var restClient = require('node-rest-client').Client;

var _options=null;
var _environment =  process.env.NODE_ENV || 'development';
if (_environment=="development") {
    _options = {baseUrl: "http://localhost:1337"}
}else if (_environment=="qa") {
    _options = {baseUrl: "http://chumbl-api-qa.azurewebsites.net"}
}else{
    _options ={baseUrl: "https://api.chumbl.com"}
}
//*********************************************************************************************************************************************************************
//exports
//*********************************************************************************************************************************************************************


var timestore={
    getValues:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/:entityId/:targetDate";
            if (!options.targetDate){url=url.replace("/:targetDate","")};
            callChumblGet(url,options,callback);
        }


    ,getTimeline:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/:entityId/timeline/:startDate/:endDate?attributes=" + options.attributes.join(",");
            callChumblGet(url,options,callback);
        }

    ,queryEntities:
        function(options,callback){

            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/entities/:targetDate";
            if (!options.targetDate){url=url.replace("/:targetDate","")};
            if (options.query){url+="?query="+options.query;}

            callChumblGet(url,options,callback);
        }

    ,setValues:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/:entityId/:targetDate";
            if (!options.targetDate){url=url.replace("/:targetDate","")};
            options.data=options.values;
            callChumblPost(url,options,callback);
        }


    ,getTimestores:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/timestores?select=_id,name";
            callChumblGet(url,options,callback);
        }
    ,getTimestore:function(options,callback){
        var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId";
        callChumblGet(url,options,callback);
    }

}

var transaction={
    saveTransaction:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId/transactions/:entityId";
            options.data=options.transaction;
            callChumblPost(url,options,callback);

        }

    ,getTransaction:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId/transactions/:entityId/:id";
            callChumblGet(url,options,callback);
        }
    ,getTransactions:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId/transactions/:entityId";
            if (options.query){
                url+="?" + options.query;
            }
            callChumblGet(url,options,callback);
        }

    ,getTransactionCount:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId/transactions/:entityId/count";
            if (options.query){
                url+="?" + options.query;
            }
            callChumblGet(url,options,callback);
        }

    ,getTransactionTypes:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes?select=_id,name";
            callChumblGet(url,options,callback);
        }
    ,getTransactionType:function(options,callback){
        var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId";
        callChumblGet(url,options,callback);
    }
}

var lookup={

    getLookups:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/lookups?select=_id,name";
            callChumblGet(url,options,callback);

        }

    ,getLookup:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/lookups/:lookupId";
            callChumblGet(url,options,callback);

        }
    ,getLookupValues:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/lookups/:lookupId/values";
            callChumblGet(url,options,callback);
        }
    ,getLookupSchema:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/lookups/:lookupId/schema";
            callChumblGet(url,options,callback);
        }
}

var chomp={
    getChompQItem:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/chompq/:chompQId";
            callChumblGet(url,options,callback);
        }
    ,addQItemStatus:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/chompq/:chompQId/status";
            options.data=options.status;
            callChumblPost(url,options,callback);
        }

    ,getChomps:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/chomps?select=_id,name";
            callChumblGet(url,options,callback);
        }
    ,getChomp:function(options,callback){
        var url=_options.baseUrl+"/:chumblr/chomps/:chompId";
        callChumblGet(url,options,callback);
    }
}


var api=
{
    timestore:timestore,
    transaction:transaction,
    chomp:chomp,
    lookup:lookup
}


module.exports=api;

function parseUrl(url,options){
    for (var k in options){
        url=url.replace(":" + k,options[k])
    }
    return url;
}




function callChumblGet(url,options,callback){

    var client=null;
    var args={
        headers:{
            "Content-Type": "application/json"
        }
    }
    var options_auth={};
    if (!options.token){
        options_auth={user:options.username,password:options.password};
    }else{
        args.headers.externalauthtoken=options.token;
        options_auth={user:options.token,password:"xxxxxx"};
    }
    client=new restClient(options_auth);

    function apiCalled(result,response){
        return parseResult(response.statusCode,result,callback);
    }

    url=parseUrl(url,options);

    var retryCnt=5;
    function tryClient(){
        function errorRetry(err){
            console.log("retrying chumbl sdk get:" + retryCnt);
            if (retryCnt>0){
                retryCnt--;
                setTimeout(tryClient,5000);

            }
            else{
                return callback('Error connecting to chumbl api', err.message);
            }
        }

        try{
            client.get(url, args, apiCalled).on('error',function(err){
                errorRetry(err);
            })
        }
        catch(exp){
            errorRetry(exp);
        }
    }

    tryClient();
}

function callChumblPost(url,options,callback){
    var client=null;
    var args={
        headers:{
            "Content-Type": "application/json"
        }
    }
    var options_auth={};
    if (!options.token){
        options_auth={user:options.username,password:options.password};
    }else{
        args.headers.externalauthtoken=options.token;
        options_auth={user:options.token,password:"xxxxxx"};
    }
    client=new restClient(options_auth);

    args.data=options.data;

    function apiCalled(result,response){
        return parseResult(response.statusCode,result,callback);
    }

    url=parseUrl(url,options);

    var retryCnt=5;
    function tryClient(){
        function errorRetry(err){
            console.log("retrying chumbl sdk get:" + retryCnt);
            if (retryCnt>0){
                retryCnt--;
                setTimeout(tryClient,5000);
            }
            else{
                return callback('Error connecting to chumbl api', err.message);
            }
        }

        try{
            client.post(url, args, apiCalled).on('error',function(err){
                errorRetry(err);
            })
        }
        catch(exp){
            errorRetry(exp);
        }
    }
    tryClient();

}


function parseResult(statusCode,result,callback){
    if (statusCode>=500){
        return callback(result);
    }
    else if (statusCode==204){
        return callback(null,null);
    }
    else if (statusCode>=200&&statusCode<300){
        return callback(null,JSON.parse(result));
    }
    else if (statusCode==404){
        if (result){return callback(null,result);}
        else{return callback(null,null);}

    }
    else if (statusCode==401){
        return callback("Not Authorised",null);
    }
    else if (statusCode==400){
        var resError = "";
        if (result){
            var resError =JSON.stringify(result);
        }
        return callback("Bad Request" + resError,null);
    }
    else{
        return callback(null,null);
    }

}
