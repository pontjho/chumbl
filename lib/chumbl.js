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
            var url="/{chumblr}/timestores/{timestoreId}/{entityId}/{targetDate}";
            if (!options.targetDate){url=url.replace("{targetDate}","")};
            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }


    ,getTimeline:
        function(options,callback){
            var attributes="";
            if (options.attributes){attributes=options.attributes.join(",");}
            var url="/{chumblr}/timestores/{timestoreId}/{entityId}/timeline/{startDate}/{endDate}?attributes=" + attributes;
            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }

    ,queryEntities:
        function(options,callback){

            var url="/{chumblr}/timestores/{timestoreId}/entities/{targetDate}";
            if (!options.targetDate){url=url.replace("/{targetDate}","")};
            if (options.query){url+="?query="+options.query;}

            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }

    ,setValues:
        function(options,callback){
            var url="/{chumblr}/timestores/{timestoreId}/{entityId}/{targetDate}";
            if (!options.targetDate){url=url.replace("/{targetDate}","")};
            options.data=options.values;
            options.verb="post";
            options.url=url;
            makeRestRequest(options,callback);
        }


    ,getTimestores:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/timestores?select=_id,name";
            makeRestRequest(options,callback);
        }
    ,getTimestore:function(options,callback){
        options.verb="get";
        options.url="/{chumblr}/timestores/{timestoreId}";
        makeRestRequest(options,callback);
    }

}

var transaction={
    saveTransaction:
        function(options,callback){

            options.data=options.transaction;
            options.verb="post";
            options.url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}";
            makeRestRequest(options,callback);

        }

    ,getTransaction:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}/{id}";
            makeRestRequest(options,callback);
        }
    ,getTransactions:
        function(options,callback){
            var url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}";
            if (options.query){
                url+="?" + options.query;
            }
            options.verb="get";
            options.url=url
            makeRestRequest(options,callback);
        }

    ,getTransactionCount:
        function(options,callback){
            var url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}/count";
            if (options.query){
                url+="?" + options.query;
            }
            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }

    ,getTransactionTypes:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/transactiontypes?select=_id,name";
            makeRestRequest(options,callback);
        }

    ,getTransactionType:function(options,callback){
        options.verb="get";
        options.url="/{chumblr}/transactiontypes/{transactionTypeId}"
        makeRestRequest(options,callback);
    }
}

var lookup={

    getLookups:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/lookups?select=_id,name";
            makeRestRequest(options,callback);
        }

    ,getLookup:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/lookups/{lookupId}";
            makeRestRequest(options,callback);

        }
    ,getLookupValues:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/lookups/{lookupId}/values";
            makeRestRequest(options,callback);
        }
    ,getLookupSchema:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/lookups/{lookupId}/schema";
            makeRestRequest(options,callback);
        }
}

var chomp={
    getChompQItem:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/chompq/{chompQId}";
            makeRestRequest(options,callback);
        }
    ,addQItemStatus:
        function(options,callback){
            options.data=options.status;
            options.verb="post";
            options.url="/{chumblr}/chompq/{chompQId}/status";
            makeRestRequest(options,callback);
        }

    ,getChomps:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/chomps?select=_id,name";
            makeRestRequest(options,callback);
        }
    ,getChomp:function(options,callback){
        options.verb="get";
        options.url="/{chumblr}/chomps/{chompId}";
        makeRestRequest(options,callback);
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
    var baseUrl=_options.baseUrl;
    if (options.baseUrl){baseUrl=options.baseUrl}
    url = baseUrl+url;

    for (var k in options){
        url=url.replace("{" + k + "}",options[k])
    }
    return url;
}


function makeRestRequest(options,callback){
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

    if (options.data){args.data=options.data;}


    function apiCalled(result,response){
        return parseResult(response.statusCode,result,callback);
    }

    var url=parseUrl(options.url,options);

    var retryCnt=5;
    function tryClient(){
        function errorRetry(err){
            console.log("retrying chumbl sdk " + options.verb + ":" + url + ":" + retryCnt + ":" + JSON.stringify(err));
            if (retryCnt>0){
                retryCnt--;
                setTimeout(tryClient,5000);

            }
            else{
                return callback('Error connecting to chumbl api:' + options.verb + ":" + url + ":" + JSON.stringify(err));
            }
        }

        try{
            client[options.verb](url, args, apiCalled).on('error',function(err){
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
